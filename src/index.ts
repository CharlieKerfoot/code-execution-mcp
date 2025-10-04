import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const server = new McpServer({
    name: "code_execution",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    }
});

const run_code = async (language: string, code: string): Promise<string | null> => {
    try {
        const response = await fetch(PISTON_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language,
                version: "*",
                files: [{ content: code }]
            })
        });
        const result = await response.json();

        return `STDOUT:\n${result.run.stdout}\nSTDERR:\n${result.run.stderr || "(none)"}\n\nExit Code: ${result.run.code}`
    } catch (err) {
        console.error("Code execution failed:", err);
        return null;
    }
}

server.tool(
    "execute_code",
    "Execute code given by the user",
    {
        language: z.string().describe("Lower-case programming language (e.g. python)"),
        code: z.string().describe("Correctly formatted code in specified programming language"),
    },
    async ({ language, code }) => {
        language = language.toLowerCase();
        console.error(language, code);
        const output = await run_code(language, code);

        if (!output) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to execute code"
                    }
                ]
            }
        }

        return {
            content: [
                {
                    type: "text",
                    text: output
                },
            ],
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Code Exectution MCP running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
})
