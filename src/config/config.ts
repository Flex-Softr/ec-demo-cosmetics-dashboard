const config = {
  env: process.env.NEXT_PUBLIC_NODE_ENV,
  main_domain: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
  api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL,
  client_base_url: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
  revalidate_secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
  courier_status_check_url: process.env.NEXT_PUBLIC_COURIER_STATUS_CHECK_URL,
  token_data: {
    access_token_cookie_expires:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_EXPIRES,
  },
  next_public_show_image_to_order:
    process.env.NEXT_PUBLIC_SHOW_IMAGE_TO_ORDER || false,
  company_info: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME,
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE,
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS,
  },
  per_item_shipping_cost: 50,
};

export default config;
