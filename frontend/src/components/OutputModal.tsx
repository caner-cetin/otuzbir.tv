// biome-ignore lint/style/useImportType: <fuck off>
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Tab, Tabs, Spinner, Button } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  MemoryStick,
} from "lucide-react";
import { BellSimpleSlash, Bug, MaskSad, QuestionMark, Queue } from '@phosphor-icons/react'
import type { GetSubmissionResponse } from "src/hooks/useJudge";

interface Submission {
  localId: number;
  globalId: number;
  token: string;
}

interface OutputModalProps {
  submissions: Submission[];
  getSubmission: (token: string) => Promise<GetSubmissionResponse>;
}

const OutputModal: React.FC<OutputModalProps> = ({
  submissions,
  getSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    submissions[0]?.token || "",
  );
  const queryClient = useQueryClient();
  const tabsRef = useRef<HTMLDivElement>(null);

  const {
    data: submissionResult,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["submission", activeTab],
    queryFn: () => getSubmission(activeTab),
    enabled: !!activeTab,
  });

  const handleRefresh = (token: string) => {
    queryClient.invalidateQueries({ queryKey: ["submission", token] });
  };

  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft = 0;
    }
  }, []);

  const getStatusIcon = (id: number) => {
    // https://judge.otuzbir.tv/docs#statuses-and-languages-status
    switch (id) {
      case 1:
        return <Queue />;
      case 2:
        return <Spinner />;
      case 3:
        return <CheckCircle />;
      case 5:
        return <BellSimpleSlash />
      case 13:
        return <MaskSad />
      case 14:
        return <QuestionMark />
      default:
        return <Bug />
    }
  };

  const renderSubmissionResult = () => {
    if (isLoading) return <Spinner animation="border" />;
    if (isError)
      return (
        <div className="text-red-500">Error fetching submission result</div>
      );
    if (!submissionResult) return null;

    return (
      <div className="bg-[#2c2a2a] p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold flex items-center">
            {getStatusIcon(submissionResult.status.id)}
            {/* well we are using a judge api, and as it is a literally judge, it returns "accepted" when the code is ran successfully */}
            {/* it is a bit weird so */}
            <span className="ml-2">
              {submissionResult.status.id === 3
                ? "Executed"
                : submissionResult.status.description}
            </span>
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="mr-2" />
              <span>{submissionResult.time} s</span>
            </div>
            <div className="flex items-center">
              <MemoryStick className="mr-2" />
              <span>{submissionResult.memory} KB</span>
            </div>
          </div>
        </div>
        {submissionResult.stdout && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Output:</h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto">
              {submissionResult.stdout}
            </pre>
          </div>
        )}
        {submissionResult.stderr && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 text-red-500">Error:</h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto text-red-400">
              {submissionResult.stderr}
            </pre>
          </div>
        )}
        {submissionResult.compile_output && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Compile Output:</h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto">
              {submissionResult.compile_output}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="output-modal">
      <div ref={tabsRef} className="overflow-x-auto whitespace-nowrap">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "")}
          className="mb-3 flex"
        >
          {submissions.map((submission) => (
            <Tab
              key={submission.token}
              eventKey={submission.token}
              title={
                <div className="flex items-center">
                  <span>Submission {submission.localId}</span>
                  {activeTab === submission.token && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ml-2 bg-[#3c3836] text-[#e9efec] border-[#555568] hover:bg-[#504945]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefresh(submission.token);
                      }}
                    >
                      <RefreshCw size={16} />
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
      <div className="mt-4">{activeTab && renderSubmissionResult()}</div>
    </div>
  );
};

export default OutputModal;
