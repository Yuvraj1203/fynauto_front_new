export const Routes = {
  public: {
    auth: "/auth",
    callback: "/auth/callback",
    error: "/auth/error",
    login: (redirect?: string) =>
      redirect
        ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
        : "/auth/login",
  },

  protected: {
    dashboard: "/dashboard",
    // createCaptureForm: (formId: "new-form" | number) =>
    //   `/capture-tool/${formId}`,
    releaseTable: "/release-table",
    settings: "/settings",
    createUser: "/create-user",
  },

  noRedirection: "/#",
} as const;
