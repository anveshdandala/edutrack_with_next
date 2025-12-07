"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AnalysisModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const { ats_results, resume_analyzer } = data;
  const score = parseFloat(
    ats_results?.total_score_line?.match(/[\d.]+/)?.[0] || 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            Resume Analysis Report
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                score >= 80
                  ? "bg-green-100 text-green-700"
                  : score >= 50
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              ATS Score: {score}/100
            </span>
          </DialogTitle>
          <DialogDescription>
            Detailed feedback to optimize your resume for ATS and recruiters.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 bg-gray-50">
          <div className="space-y-6">
            {/* 1. ATS Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                ATS Compatibility Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {ats_results?.breakdown_lines?.map((line, idx) => {
                  const [label, valStr] = line.split(":");
                  const val = parseFloat(valStr?.trim() || 0);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium">{val}%</span>
                      </div>
                      <Progress value={val} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Detailed Section Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Detailed Feedback
              </h3>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {Object.entries(resume_analyzer?.sections || {}).map(
                  ([sectionName, feedbackItems], idx) => (
                    <AccordionItem
                      key={idx}
                      value={sectionName}
                      className="bg-white border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 text-left">
                          <span className="font-medium capitalize text-gray-700">
                            {sectionName.toLowerCase().replace(/_/g, " ")}
                          </span>
                          <CountBadges items={feedbackItems} />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-2">
                        {feedbackItems.map((item, i) => (
                          <FeedbackItem key={i} text={item} />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Helper: Renders check/cross items
function FeedbackItem({ text }) {
  const isPositive = text.trim().startsWith("✔");
  const isNegative = text.trim().startsWith("✘");
  const content = text.replace(/^[✔✘]\s*/, "");

  return (
    <div
      className={`flex items-start gap-2 p-2 rounded-md ${
        isPositive
          ? "bg-green-50 text-green-800"
          : isNegative
          ? "bg-red-50 text-red-800"
          : "bg-gray-50 text-gray-700"
      }`}
    >
      {isPositive ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
      ) : isNegative ? (
        <XCircle className="h-5 w-5 shrink-0 text-red-600" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-gray-500" />
      )}
      <span className="text-sm leading-relaxed">{content}</span>
    </div>
  );
}

// Helper: Badges for summary in accordion trigger
function CountBadges({ items }) {
  const good = items.filter((i) => i.trim().startsWith("✔")).length;
  const bad = items.filter((i) => i.trim().startsWith("✘")).length;

  return (
    <div className="flex gap-2 text-xs">
      {good > 0 && (
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> {good}
        </span>
      )}
      {bad > 0 && (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
          <XCircle className="h-3 w-3" /> {bad}
        </span>
      )}
    </div>
  );
}
