export async function generateMetadata({ params }: { params: { id: string } }) {
    const ogImageUrl = `https://omniplex.ai/api/og?id=${params.id}`;
    return {
        title: "Omniplex",
        description: "Search online with the power of AI. Try now!",
        openGraph: {
            title: "Omniplex - Web Search AI",
            description: "Search online with the power of AI. Try now!",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: "Omniplex - Web Search AI",
                },
            ],
            url: `https://omniplex.ai/chat/${params.id}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Omniplex - Web Search AI",
            description: "Search online with the power of AI. Try now!",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: "Omniplex - Web Search AI",
                },
            ],
        },
    };
} 