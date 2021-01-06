import axios from "axios";
import React, { useEffect, useState } from "react";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

import ENV from "tools/client-env";

export const LedgerHelpText = () => {
  const [contentfulData, setContentfulData] = useState<any>(null);

  useEffect(() => {
    const getAndSaveData = async () => {
      const response = await axios.get(
        `${ENV.SERVER_URL}/api/my-ledger-doesnt-work`,
      );

      setContentfulData(response.data);
    };

    getAndSaveData();
  }, []);

  return (
    <>
      {contentfulData?.items?.[0]?.fields?.content
        ? documentToReactComponents(contentfulData.items[0].fields.content, {
            renderNode: {
              [BLOCKS.EMBEDDED_ASSET]: node => {
                console.log(node);

                return (
                  <img
                    alt="from contentful"
                    src={node.data.target.fields.file.url}
                  />
                );
              },
            },
          })
        : null}
    </>
  );
};
