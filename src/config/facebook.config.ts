export type FacebookConfig = {
  FB_VERIFY_TOKEN: string
};

let fbConfig: FacebookConfig = {
  FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN || '1234-1234'
};

export default fbConfig;
