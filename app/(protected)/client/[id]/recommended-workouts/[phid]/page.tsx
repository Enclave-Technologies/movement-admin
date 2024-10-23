"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string; phid: string } }) => {
    const { userData, setUserData } = useUser();
    const [pageLoading, setPageLoading] = useState(true);
    const page_title = ["Training Program", "Untitled Phase"];

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                if (isMounted) {
                    setUserData(response.data);
                    setPageLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (isMounted) {
                    setPageLoading(false); // Set loading to false in case of error
                }
            }
        };

        setPageLoading(true); // Set loading to true before fetching data

        if (!userData) {
            fetchData();
        } else {
            setPageLoading(false); // Set loading to false if userData is already available
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted components
        };
    }, [params.id, setUserData, userData]);

    return pageLoading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
        </div>
    );
};

export default Page;
