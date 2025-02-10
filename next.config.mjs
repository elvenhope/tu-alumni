/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["picsum.photos", "i.ibb.co", "drive.google.com"], // Add the domain here
	},
	/* config options here */
};

export default withNextIntl(nextConfig);
