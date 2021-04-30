import { useDispatch, useSelector } from "react-redux";

import Scripting from "../components/Scripting";
import { useEffect } from "react";
import UserScriptList from "../components/Scripting/UserScriptList";

export default function ScriptPage({ apiUrl }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.user?.token);

  const ir = useSelector((state) => state?.script?.ir);

  useEffect(() => {
    (async () => {
      if (ir && apiUrl) {
        fetch(`${apiUrl}/scripting/compile`, {
          method: "POST",
          body: JSON.stringify(ir),
        });
      }
    })();
  }, [ir, apiUrl]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetch(`${apiUrl}/scripting/schema`)
          .then((r) => r.json())
          .then((schema) => {
            dispatch({
              type: "SCRIPT.SET_SCHEMA",
              schema,
            });
            return schema;
          }),
        token
          ? fetch(`${apiUrl}/scripting/my-programs`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((r) => r.json())
              .then((userScriptList) =>
                dispatch({
                  type: "SCRIPT.SET_SCRIPT_LIST",
                  userScriptList,
                })
              )
          : Promise.resolve(),
      ]);
    })();
  }, [apiUrl]);

  return (
    <>
      <UserScriptList />
      <Scripting />
    </>
  );
}

export async function getStaticProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
