export type FacebookConfig = {
  FB_VERIFY_TOKEN: string,
  FB_PAGE_ID: string,
  FB_PAGE_TOKEN: string
};

let fbConfig: FacebookConfig = {
  FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
  FB_PAGE_ID: process.env.FB_PAGE_ID,
  FB_PAGE_TOKEN: process.env.FB_PAGE_TOKEN
};

export default fbConfig;
