import "./globals.css";
import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import { Metadata } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnimalContainer from "../containers/AnimalContainer";
import TaskContainer from "../containers/TaskContainer";
import UsersContainer from "../containers/UsersContainer";
import { SessionProvider } from "next-auth/react";
import ShelterContainer from "../containers/ShelterContainer";
import DataInitializer from "../components/DataInitializer/DataInitializer";
import LocationContainer from "../containers/LocationContainer";

export const metadata: Metadata = {
  title: "Project Tailwind",
  description: "Powered by Best Friends Animal Society",
};

const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ShelterContainer.Provider>
            <DataInitializer>
              <UsersContainer.Provider>
                <AnimalContainer.Provider>
                  <TaskContainer.Provider>
                    <LocationContainer.Provider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </LocationContainer.Provider>
                  </TaskContainer.Provider>
                </AnimalContainer.Provider>
              </UsersContainer.Provider>
            </DataInitializer>
          </ShelterContainer.Provider>
        </QueryClientProvider>
      </SessionProvider>
    </main>
  );
};

export default MyApp;
