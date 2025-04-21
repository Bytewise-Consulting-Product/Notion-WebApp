import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Payload } from "../../../prisma/src/app/generate/prisma/runtime/library";

export interface UserTypes {
  uid: string;
  name: string;
  email: string;
  image: string;
}

export interface WorkSpaceTypes {
  wid: string;
  name: string;
  // more to be added
}

export interface PagesTypes {
  pid: string;
  ppid: string;
  title: string;
  private: boolean;
}

export interface ContentTypes {
  pid: string;
  cid: string;
  type: string; // Singular "type"
  content: string;
  order: number;
}

export interface UserDataType {
  user: UserTypes;
  workspace: WorkSpaceTypes[];
  pages: PagesTypes[];
  contents: ContentTypes[];
}

export const UserDataSlice = createSlice({
  name: "userData",
  initialState: {
    // user: {
    //   uid: "",
    //   name: "",
    //   email: "",
    //   image: "",
    // },

    // workspace: [
    //   {
    //     wid: "",
    //     name: "",
    //   },
    // ],

    // pages: [
    //   {
    //     pid: "",
    //     ppid: "",
    //     title: "",
    //     private: false,
    //   },
    // ],

    // content: [
    //   {
    //     pid: "",
    //     cid: "",
    //     type: "",
    //     content: "",
    //     order: 0,
    //   },
    // ],

    user: {} as UserTypes,
    workspace: {} as WorkSpaceTypes,
    pages: [] as PagesTypes[],
    content: [] as ContentTypes[],
  },
  reducers: {
    setUser: (state, actions: PayloadAction<UserTypes>) => {
      state.user.email = actions.payload.email;
      state.user.uid = actions.payload.uid;
      state.user.image = actions.payload.image;
      state.user.name = actions.payload.name;
    },
    setWorkSpace: (state, actions: PayloadAction<WorkSpaceTypes[]>) => {
      actions.payload.map((data) =>
        state.workspace.push({
          wid: data.wid,
          name: data.name,
        })
      );
    },
    setPages: (state, actions: PayloadAction<PagesTypes[]>) => {
      state.pages = actions.payload;
    },
    setContents: (state, actions: PayloadAction<ContentTypes[]>) => {
      state.content = actions.payload;
    },
    setNewPage: (
      state,
      actions: PayloadAction<{ title: string; private: boolean }>
    ) => {
      state.pages.push({
        pid: "",
        title: actions.payload.title,
        ppid: "",
        private: actions.payload.private,
      });
    },

    setUpdatePage: (state, actions: PayloadAction<PagesTypes>) => {
      const pageToUpdate = state.pages.find(
        (page) => page.title === actions.payload.title
      );

      if (pageToUpdate) {
        pageToUpdate.pid = actions.payload.pid;
        pageToUpdate.ppid = actions.payload.ppid;
        pageToUpdate.title = actions.payload.title;
        pageToUpdate.private = actions.payload.private;
      }
    },

    setNewContent: (state, actions: PayloadAction<ContentTypes>) => {
      state.content.push({
        pid: actions.payload.pid,
        cid: actions.payload.cid, // ""
        content: actions.payload.content, // ""
        type: actions.payload.type,
        order: actions.payload.order,
      });
    },

    updateContent: (state, actions: PayloadAction<ContentTypes>) => {
      state.content.map((content) => {
        if (content.pid === actions.payload.pid && content.cid == "") {
          // after getting the first cid with ""
          content.content = actions.payload.content;
          content.order = actions.payload.order;
          return;
        }
      });
    },
  },
});

export const {
  setUser,
  setPages,
  setContents,
  setNewPage,
  setUpdatePage,
  setNewContent,
  updateContent,
} = UserDataSlice.actions;
export default UserDataSlice.reducer;
