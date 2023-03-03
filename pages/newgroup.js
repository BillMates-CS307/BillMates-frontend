import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Creategroup from "./forms/newgroup_form";
import { userService } from "./services/authorization";
import Header from "./globals/Header";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps({ req, res }) {
  const { email, token } = userService.getEmailFromToken({ req, res });
  if (email == null) {
    return { props: {}, redirect: { permanent: false, destination: "/" } };
  }
  return { props: { user: email } };
}

export default function Home({ user }) {
  console.log(user);
  return (
    <>
      <Head>
        <title>Create a New Group</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Header></Header>
        <div className={styles.position_box}>
          <Creategroup user={user}></Creategroup>
        </div>
      </main>
    </>
  );
}
