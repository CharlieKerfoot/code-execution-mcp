# Code Executer MCP

A Model Context Protocol (MCP) server which allows AI models to run code. The user prompts the model with code of a specified language and the model will execute it, displaying the stdout, stderr, and exit code.

## Implementation

The server uses the [piston](https://github.com/engineer-man/piston?tab=readme-ov-file#Public-API) api to execute code in a secure, remote enviornment and then returns the output to the AI model. 

Information on MCP servers and how to implement them can be found [here](https://modelcontextprotocol.io/). 

## Installation

This MCP was used and tested with [Claude for Desktop](https://claude.ai/download), but it should work for other LLMs and AI tools. This guide will only cover Claude Desktop though.

1) Clone the repo

2) Install the dependencies

```
npm i
```

3) Run 

``` 
npm run build
```

4) After installing Claude for Desktop, open the file `~/Library/Application Support/Claude/claude_desktop_config.json`

5) Paste the following JSON

```
{
  "mcpServers": {
    "code_execution": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/PARENT/FOLDER/code-execution-mcp/build/index.js"]
    }
  }
}
```

6) Save the file and launch Claude.

There should be a slider icon under the prompt bar. When clicked, the code_exection MCP should be toggleable.

## Usage

Try using the MCP with prompts like

```
run this python code:
import random

print("Random Numbers:", [random.randint(1, 100) for _ in range(5)])
print("Random Choice:", random.choice(['apple', 'banana', 'cherry', 'date']))
print("Random Float:", round(random.random() * 100, 2))

for i in range(3):
    print(f"Line {i+1}: {'*' * random.randint(3, 10)}")

print("Done!")
```

or 

```
Generate random C code (that prints to the stdout) and run it
```
