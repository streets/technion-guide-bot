export type FacebookConfig = {
  FB_VERIFY_TOKEN: string,
  FB_PAGE_ID: string
};

let fbConfig: FacebookConfig = {
  FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
  FB_PAGE_ID: process.env.FB_PAGE_ID
};

export default fbConfig;
