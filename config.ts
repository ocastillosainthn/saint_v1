type ProjectConfig = {
  [key: string]: {
    url: string;
    anonKey: string;
  };
};

const projectConfigs: ProjectConfig = {
  "ff695616-1f26-46e2-b95d-b92b76a3f89f": {
    url: "https://phnpalffthkimmhufuuq.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...7Kr1nJddHT87KJU0MabsgeZcIb4wal5-KabW5_Y4J0k"
  },
  "3fbadbf4-2d13-48b8-8cc5-661dbd65a987": {
    url: "https://wurdxmrnpdfgvgkzystf.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...q_4k7QKuXgYQRcDxxNqx01C58HB9JLMNR_Y9pFGfhgU"
  },
  // más configuraciones...
};

export default projectConfigs;
