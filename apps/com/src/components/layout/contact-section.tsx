"use client";

import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 text-black dark:text-white">
            Get In Touch
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Let&lsquo;s discuss your next project or explore opportunities to
            collaborate.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <a
              href="mailto:gabriel@example.com"
              className="block"
              tabIndex={-1}
            >
              <Card className="card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-1 hover:scale-105 h-full">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-3 transition-all duration-300 hover:scale-110">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">Email</h3>
                  <p className="caption">gabrielhalus@gmail.com</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-7 pointer-events-none opacity-70"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </a>

            <a
              href="https://wa.me/789038887?text=Hello%20Gabriel,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              tabIndex={-1}
            >
              <Card className="card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-3 hover:scale-105 h-full">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-3 transition-all duration-300 hover:scale-110">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">Quick Chat</h3>
                  <p className="caption">Available 9-5 CET</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-7 pointer-events-none opacity-70"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-8 text-center">
            <p className="caption mb-4">Or connect with me on</p>
            <div className="flex justify-center gap-3">
              <Button
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <a
                  href="https://github.com/gabrielhalus"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <a
                  href="https://linkedin.com/in/gabrielhalus"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
