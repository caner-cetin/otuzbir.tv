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
  Cpu,
  Calendar,
  Hash,
  FileCode,
  Terminal,
} from "lucide-react";
import { BellSimpleSlash, Bug, MaskSad, QuestionMark, Queue } from '@phosphor-icons/react'
import type { GetSubmissionResponse } from "src/hooks/useJudge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const renderPerformanceCharts = () => {
    if (!submissionResult) return null;

    const memoryData = [
      { name: 'Memory Usage', value: submissionResult.memory },
      { name: 'Memory Limit', value: submissionResult.memory_limit },
    ];

    const timeData = [
      { name: 'Exec Time', value: Number.parseFloat(submissionResult.time) * 1000 },
      { name: 'Wall Time', value: Number.parseFloat(submissionResult.wall_time) * 1000 },
      { name: 'CPU Time Limit', value: Number.parseFloat(submissionResult.cpu_time_limit) * 1000 },
    ];

    return (
      <div className="mb-4">
        <h5 className="font-semibold mb-2">Performance Metrics</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h6 className="text-center">Memory Usage (KB)</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memoryData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h6 className="text-center">Time Usage (milliseconds)</h6>
            <ResponsiveContainer width="100%" height={305}>
              <BarChart data={timeData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={105}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold flex items-center">
            {getStatusIcon(submissionResult.status.id)}
            <span className="ml-2">
              {submissionResult.status.id === 3
                ? "Executed"
                : submissionResult.status.description}
            </span>
          </h4>
        </div>

        <div className="text-sm">
          <span className="mr-2">{submissionResult.language.name}</span>
          <span>exited with code {submissionResult.exit_code}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4 mt-2">
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Exec: {submissionResult.time}s</span>
          </div>
          <div className="flex items-center">
            <Cpu className="mr-1 w-4 h-4" />
            <span>CPU: {submissionResult.cpu_time_limit}s</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Wall: {submissionResult.wall_time}s</span>
          </div>
          <div className="flex items-center">
            <MemoryStick className="mr-1 w-4 h-4" />
            <span>Mem: {submissionResult.memory}KB</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>Created: {new Date(submissionResult.created_at).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>Finished: {new Date(submissionResult.finished_at).toLocaleTimeString()}</span>
          </div>
        </div>


        {submissionResult.stdout && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Output:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto">
              {submissionResult.stdout}
            </pre>
          </div>
        )}
        {submissionResult.stderr && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 text-red-500 flex items-center">
              <Terminal className="mr-2" />
              Error:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto text-red-400">
              {submissionResult.stderr}
            </pre>
          </div>
        )}
        {submissionResult.compile_output && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Compile Output:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto">
              {submissionResult.compile_output}
            </pre>
          </div>
        )}
        {submissionResult.message && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Message:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto">
              {submissionResult.message}
            </pre>
          </div>
        )}
        {renderPerformanceCharts()}

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
