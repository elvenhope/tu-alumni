/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
	reactStrictMode: true,
	/* config options here */
};

export default withNextIntl(nextConfig);
