export type TBlogStatus = "draft" | "published" | "archived";
export type TBlogTaxonomyStatus = "active" | "inactive";
export type TBlogPostType = "pillar" | "medium" | "hub";

export type TEntityRef = {
  _id: string;
  name?: string;
  title?: string;
  question?: string;
  slug?: string;
  email?: string;
  fullName?: string;
  url?: string;
  src?: string;
  alt?: string;
};

export type TSeo = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  schemaMarkup?: string;
};

export type TBlogQACategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  seo?: TSeo;
  status: TBlogTaxonomyStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlogQATag = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: TBlogTaxonomyStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlogQATopic = {
  _id: string;
  name: string;
  slug: string;
  category: string | TEntityRef;
  description?: string;
  seo?: TSeo;
  status: TBlogTaxonomyStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlogPost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  readTime?: number;
  category: string | TEntityRef;
  topic?: string | TEntityRef;
  tags?: Array<string | TEntityRef>;
  featuredImage?: string | TEntityRef;
  relatedBlogs?: Array<string | TEntityRef>;
  seo?: TSeo;
  status: TBlogStatus;
  publishedAt?: string;
  views: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TQnA = {
  _id: string;
  question: string;
  slug: string;
  answer: string;
  category: string | TEntityRef;
  topic: string | TEntityRef;
  tags?: Array<string | TEntityRef>;
  relatedQuestions?: Array<string | TEntityRef>;
  seo?: TSeo;
  status: TBlogStatus;
  publishedAt?: string;
  views: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlogQACategoryPayload = Omit<
  TBlogQACategory,
  "_id" | "createdAt" | "updatedAt"
>;

export type TBlogQATagPayload = Omit<
  TBlogQATag,
  "_id" | "createdAt" | "updatedAt"
>;

export type TBlogPostPayload = Omit<
  TBlogPost,
  "_id" | "createdAt" | "updatedAt" | "views"
>;

export type TQnAPayload = Omit<
  TQnA,
  "_id" | "createdAt" | "updatedAt" | "views"
>;
