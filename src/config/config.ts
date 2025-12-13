const config = {
  env: process.env.NEXT_PUBLIC_NODE_ENV,
  main_domain: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
  base_url: process.env.NEXT_PUBLIC_API_BASE_URL,
  base_client_url: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
  courier_api_key: process.env.NEXT_PUBLIC_COURIER_API_KEY,
  courier_secret_key: process.env.NEXT_PUBLIC_COURIER_SECRET_KEY,
  courier_url: process.env.NEXT_PUBLIC_COURIER_URL,
  token_data: {
    access_token_cookie_expires:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_EXPIRES,
  },
  next_public_show_ito: process.env.NEXT_PUBLIC_SHOW_ITO || false,
};

export default config;
