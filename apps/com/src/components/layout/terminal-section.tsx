"use client";

import { Play, Square, Terminal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const commands = [
  {
    command: "npm create next-app@latest",
    output:
      "Creating a new Next.js app with TypeScript and Tailwind CSS...\n✓ Project initialized successfully",
  },
  {
    command: "docker-compose up -d",
    output:
      "Starting services...\n✓ PostgreSQL container started\n✓ Redis container started\n✓ Application ready on port 3000",
  },
  {
    command: "cargo build --release",
    output:
      "Compiling Rust application...\n✓ Optimized build completed\n✓ Binary size: 2.4MB",
  },
  {
    command: "kubectl apply -f deployment.yaml",
    output:
      "Deploying to Kubernetes cluster...\n✓ Pods: 3/3 ready\n✓ Service exposed on port 80",
  },
];

export function TerminalSection() {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");

  const runCommand = useCallback(async () => {
    if (isRunning)
      return;

    setIsRunning(true);
    setOutput("");

    const command = commands[currentCommand];

    // Simulate typing the command
    for (let i = 0; i <= command.command.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setOutput(
        `$ ${command.command.substring(0, i)}${
          i < command.command.length ? "_" : ""
        }`,
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Show the output
    setOutput(`$ ${command.command}\n${command.output}`);

    setIsRunning(false);

    // Auto-advance to next command
    setTimeout(() => {
      setCurrentCommand(prev => (prev + 1) % commands.length);
    }, 2000);
  }, [currentCommand, isRunning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) {
        runCommand();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentCommand, isRunning, runCommand]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 text-black dark:text-white">
            CLI Tools & Automation
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Streamlined development workflows with powerful command-line tools
            and automation scripts.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-black border-0 text-green-400 font-mono card-radius animate-slide-up hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 animate-pulse-glow" />
                  <CardTitle className="text-green-400 text-sm">
                    gabriel@dev-machine:~
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse animate-stagger-1"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animate-stagger-2"></div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={runCommand}
                    disabled={isRunning}
                    className="text-green-400 hover:text-green-300 hover:bg-green-400/10 h-6 w-6 p-0 transition-all duration-300 hover:scale-110"
                  >
                    {isRunning
                      ? (
                          <Square className="h-3 w-3" />
                        )
                      : (
                          <Play className="h-3 w-3" />
                        )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="bg-black/50 p-3 rounded-lg min-h-[120px] transition-all duration-300">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap">
                  {output || "$ Ready to execute commands..."}
                </pre>
              </div>

              <div className="grid md:grid-cols-2 gap-3 animate-fade-in">
                <div className="space-y-1 animate-slide-in-left">
                  <h4 className="text-white font-medium text-sm">
                    Development Tools
                  </h4>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>• Custom build systems with Bun & Vite</li>
                    <li>• Automated testing suites</li>
                    <li>• Database migration tools</li>
                    <li>• API documentation generators</li>
                  </ul>
                </div>
                <div className="space-y-1 animate-slide-in-right">
                  <h4 className="text-white font-medium text-sm">
                    Deployment & Ops
                  </h4>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>• Docker containerization</li>
                    <li>• Kubernetes orchestration</li>
                    <li>• CI/CD pipeline automation</li>
                    <li>• Server monitoring scripts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
