import { useMemo } from 'react';
import { useLandingPageData } from '../context/LandingPageContext';
import { getLandingPageSchema } from '../utils/structuredData';
import { fallbackSEOData } from '../data/fallbackData';

/**
 * Custom hook for dynamic SEO data generation
 * Combines backend SEO data with page-specific content
 */
export const useSEO = (pageType = 'landing', pageData = {}) => {
  const { seoData, categories, featuredProducts } = useLandingPageData();

  const seoConfig = useMemo(() => {
    // Base SEO configuration
    const baseSEO = {
      title: "Fresh Farm Products Online | Organic Vegetables & Local Produce | MyStore",
      description: "Order fresh, organic farm products online. Local vegetables, fruits, and produce delivered to your door. Supporting sustainable farming and local communities.",
      keywords: "fresh farm products, organic vegetables, local produce, farm delivery, sustainable farming, organic food store",
      canonicalUrl: "https://mystore.com/",
      ogImage: "https://mystore.com/images/og-hero-farm.jpg",
      siteName: "MyStore - Fresh Farm Products"
    };

    // Merge with backend SEO data if available
    const mergedSEO = {
      ...baseSEO,
      ...(seoData || fallbackSEOData),
      ...pageData
    };

    // Page-specific SEO configurations
    switch (pageType) {
      case 'landing':
        return {
          ...mergedSEO,
          title: mergedSEO.title || "Fresh Farm Products Online | MyStore",
          description: mergedSEO.description || "Discover the freshest organic vegetables, fruits, and farm products delivered directly from local farms to your doorstep.",
          keywords: [
            mergedSEO.keywords,
            "organic farming",
            "local farmers",
            "fresh produce delivery",
            "sustainable agriculture",
            "farm to table",
            "organic vegetables online",
            "fresh fruit delivery"
          ].filter(Boolean).join(", "),
          ogType: "website",
          structuredData: getLandingPageSchema(categories, featuredProducts)
        };

      case 'category':
        const categoryName = pageData.categoryName || 'Products';
        return {
          ...mergedSEO,
          title: `${categoryName} | Fresh Organic ${categoryName} | MyStore`,
          description: `Shop fresh organic ${categoryName.toLowerCase()} online. Locally sourced, pesticide-free ${categoryName.toLowerCase()} delivered to your door. Quality guaranteed.`,
          keywords: `organic ${categoryName.toLowerCase()}, fresh ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} delivery, local ${categoryName.toLowerCase()}`,
          canonicalUrl: `https://mystore.com/categories/${pageData.categorySlug}`,
          ogType: "website"
        };

      case 'product':
        const productName = pageData.productName || 'Product';
        return {
          ...mergedSEO,
          title: `${productName} | Fresh Organic Produce | MyStore`,
          description: pageData.productDescription || `Buy fresh ${productName.toLowerCase()} online. Organic, locally sourced, and delivered fresh to your door.`,
          keywords: `${productName.toLowerCase()}, organic ${productName.toLowerCase()}, fresh ${productName.toLowerCase()}, buy ${productName.toLowerCase()} online`,
          canonicalUrl: `https://mystore.com/products/${pageData.productSlug}`,
          ogType: "product",
          ogImage: pageData.productImage || mergedSEO.ogImage
        };

      case 'search':
        const searchQuery = pageData.searchQuery || '';
        return {
          ...mergedSEO,
          title: searchQuery 
            ? `Search Results for "${searchQuery}" | MyStore`
            : "Search Products | MyStore",
          description: searchQuery
            ? `Find fresh organic products matching "${searchQuery}". Browse our selection of farm-fresh produce and organic goods.`
            : "Search our complete selection of fresh organic farm products, vegetables, fruits, and local produce.",
          keywords: `search ${searchQuery}, find products, organic search, farm products search`,
          canonicalUrl: `https://mystore.com/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
          noIndex: !searchQuery, // Don't index empty search pages
          ogType: "website"
        };

      default:
        return mergedSEO;
    }
  }, [pageType, pageData, seoData, categories, featuredProducts]);

  // Generate dynamic meta tags
  const metaTags = useMemo(() => {
    const tags = [];

    // Basic meta tags
    tags.push(
      { name: 'title', content: seoConfig.title },
      { name: 'description', content: seoConfig.description },
      { name: 'keywords', content: seoConfig.keywords }
    );

    // Open Graph tags
    tags.push(
      { property: 'og:title', content: seoConfig.title },
      { property: 'og:description', content: seoConfig.description },
      { property: 'og:type', content: seoConfig.ogType || 'website' },
      { property: 'og:url', content: seoConfig.canonicalUrl },
      { property: 'og:site_name', content: seoConfig.siteName }
    );

    if (seoConfig.ogImage) {
      tags.push({ property: 'og:image', content: seoConfig.ogImage });
    }

    // Twitter Card tags
    tags.push(
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoConfig.title },
      { name: 'twitter:description', content: seoConfig.description }
    );

    if (seoConfig.ogImage) {
      tags.push({ name: 'twitter:image', content: seoConfig.ogImage });
    }

    // Robots tag
    const robotsContent = [
      seoConfig.noIndex ? 'noindex' : 'index',
      seoConfig.noFollow ? 'nofollow' : 'follow'
    ].join(', ');
    tags.push({ name: 'robots', content: robotsContent });

    return tags;
  }, [seoConfig]);

  // Generate breadcrumb data
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ name: 'Home', url: 'https://mystore.com/' }];

    switch (pageType) {
      case 'category':
        crumbs.push({
          name: pageData.categoryName || 'Category',
          url: `https://mystore.com/categories/${pageData.categorySlug}`
        });
        break;

      case 'product':
        if (pageData.categoryName && pageData.categorySlug) {
          crumbs.push({
            name: pageData.categoryName,
            url: `https://mystore.com/categories/${pageData.categorySlug}`
          });
        }
        crumbs.push({
          name: pageData.productName || 'Product',
          url: `https://mystore.com/products/${pageData.productSlug}`
        });
        break;

      case 'search':
        crumbs.push({
          name: 'Search',
          url: 'https://mystore.com/search'
        });
        if (pageData.searchQuery) {
          crumbs.push({
            name: `"${pageData.searchQuery}"`,
            url: `https://mystore.com/search?q=${encodeURIComponent(pageData.searchQuery)}`
          });
        }
        break;
    }

    return crumbs;
  }, [pageType, pageData]);

  return {
    seoConfig,
    metaTags,
    breadcrumbs,
    structuredData: seoConfig.structuredData,
    isLoading: !seoData && !fallbackSEOData
  };
};

/**
 * Hook for product-specific SEO
 */
export const useProductSEO = (product) => {
  return useSEO('product', {
    productName: product?.name,
    productSlug: product?.slug,
    productDescription: product?.meta_description || product?.description,
    productImage: product?.images?.[0]?.image,
    categoryName: product?.category?.name,
    categorySlug: product?.category?.slug
  });
};

/**
 * Hook for category-specific SEO
 */
export const useCategorySEO = (category) => {
  return useSEO('category', {
    categoryName: category?.name,
    categorySlug: category?.slug,
    categoryDescription: category?.description
  });
};

/**
 * Hook for search-specific SEO
 */
export const useSearchSEO = (searchQuery, results = []) => {
  return useSEO('search', {
    searchQuery,
    resultsCount: results.length
  });
};

/**
 * Hook for landing page SEO
 */
export const useLandingPageSEO = () => {
  return useSEO('landing');
};

export default useSEO;
