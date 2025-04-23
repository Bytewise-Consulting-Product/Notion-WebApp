"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setNewContent, updateContent } from "@/store/features/UserDataSlice";

import axios from "axios";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotionDynamicPage({
  pid,
}: {
  pid: string | string[] | null;
}) {
  const pageContent = useAppSelector((state) => state.userData.content);
  const dispatch = useAppDispatch();

  const [fetchContent, setFetchContent] = useState<string>("");
  const [changeContent, setChangeContent] = useState<string>("");
  const [selectCid, setSelectCid] = useState<string>("");

  const cachedFn = useCallback(async () => {
    try {
      const response = await axios.post("/api/content-update", {
        pid: pid,
        cid: selectCid,
        data: {
          order: 0,
          type: "text",
          content: changeContent,
        },
      });

      console.log(response);

      dispatch(
        updateContent({
          pid: pid as string,
          cid: response.data.cid,
          content: changeContent,
          order: 1,
          type: "text",
        })
      );

      setSelectCid(response.data.cid);

      toast("Updated");
    } catch (err) {
      console.error(err);
    }
  }, [changeContent, pid, selectCid, dispatch]);

  // debounce
  useEffect(() => {
    if (changeContent === fetchContent) {
      return;
    }

    const timer = setTimeout(() => {
      cachedFn();
    }, 1400);

    return () => {
      clearTimeout(timer);
    };
  }, [changeContent, fetchContent, cachedFn]);

  return (
    <>
      <div className="display flex-col flex gap-3">
        {pageContent.map(
          (content) =>
            content.pid === pid && (
              <Textarea
                key={content.cid}
                defaultValue={content.content || content.order}
                // value={changeContent}
                onClick={() => {
                  setFetchContent(content.content);
                  setChangeContent(content.content);
                  setSelectCid(content.cid);
                }}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setChangeContent(e.target.value);
                }}
              />
            )
        )}
      </div>

      <button
        className="border p-2 hover:bg-gray-100 rounded-2xl mt-10"
        onClick={() => {
          // dispatch
          dispatch(
            setNewContent({
              pid: pid as string,
              cid: "",
              content: "",
              order: 1,
              type: "text",
            })
          );

          // send the request
          // setData();
        }}
      >
        Add new
      </button>
    </>
  );
}
