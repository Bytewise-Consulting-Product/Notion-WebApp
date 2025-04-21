"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setNewContent, updateContent } from "@/store/features/UserDataSlice";
import { Content } from "@radix-ui/react-navigation-menu";

import axios, { AxiosError } from "axios";
import { trackSynchronousRequestDataAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
import { totalmem } from "os";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotionDynamicPage({ pid }: { pid: string }) {
  const pageContent = useAppSelector((state) => state.userData.content);
  const dispatch = useAppDispatch();

  console.log(pageContent);

  const [fetchContent, setFetchContent] = useState<string>("");
  const [changeContent, setChangeContent] = useState<string>("");
  const [selectCid, setSelectCid] = useState<string>("");
  const [order, setOrder] = useState<number>(0);

  async function updateData() {
    try {
      const response = await axios.post("/api/content-update", {
        pid: pid,
        cid: selectCid,
        data: {
          order: order,
          type: "text",
          content: changeContent,
        },
      });

      toast("Updated");

      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  // debounce
  useEffect(() => {
    if (changeContent === fetchContent) {
      return;
    }

    const timer = setTimeout(() => {
      updateData();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [changeContent]);

  async function setData() {
    try {
      const response = await axios.post("/api/content-update", {
        pid: pid,
        cid: null,
        data: { content: "", order: 1, type: "text" },
      });

      console.log(response);

      toast("Updated");

      // dispatch
      dispatch(
        updateContent({
          pid: pid,
          cid: response.data.cid as String,
          order: 1,
          type: "text",
        })
      );
    } catch (err) {
      // throw new Error(err);
      console.log(err);
    }
  }

  return (
    <>
      {pageContent.map(
        (content) =>
          content.pid === pid && (
            <Textarea
              key={content.cid || content.order}
              defaultValue={content.content}
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

      <button
        className="border p-2 hover:bg-gray-100 rounded-2xl"
        onClick={() => {
          // dispatch
          dispatch(
            setNewContent({
              pid: pid,
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
        Add new content
      </button>
    </>
  );
}
