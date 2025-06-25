import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  fetchCategories, 
  fetchFeaturedProducts, 
  fetchSEOData,
  fetchProductRating 
} from '../services/landingPageService';
import { 
  fallbackCategories, 
  fallbackProducts, 
  fallbackSEOData,
  fallbackTestimonials,
  fallbackValuePropositions 
} from '../data/fallbackData';

// Create context
const LandingPageContext = createContext();

// Initial state
const initialState = {
  // Data
  categories: [],
  featuredProducts: [],
  seoData: null,
  testimonials: fallbackTestimonials,
  valuePropositions: fallbackValuePropositions,
  
  // Loading states
  loading: true,
  categoriesLoading: false,
  productsLoading: false,
  seoLoading: false,
  
  // Error states
  error: null,
  categoriesError: null,
  productsError: null,
  seoError: null,
  
  // Cache timestamps
  lastFetch: null,
  categoriesLastFetch: null,
  productsLastFetch: null,
  seoLastFetch: null
};

// Action types
const actionTypes = {
  LOADING_START: 'LOADING_START',
  LOADING_SUCCESS: 'LOADING_SUCCESS',
  LOADING_ERROR: 'LOADING_ERROR',
  
  CATEGORIES_LOADING_START: 'CATEGORIES_LOADING_START',
  CATEGORIES_LOADING_SUCCESS: 'CATEGORIES_LOADING_SUCCESS',
  CATEGORIES_LOADING_ERROR: 'CATEGORIES_LOADING_ERROR',
  
  PRODUCTS_LOADING_START: 'PRODUCTS_LOADING_START',
  PRODUCTS_LOADING_SUCCESS: 'PRODUCTS_LOADING_SUCCESS',
  PRODUCTS_LOADING_ERROR: 'PRODUCTS_LOADING_ERROR',
  
  SEO_LOADING_START: 'SEO_LOADING_START',
  SEO_LOADING_SUCCESS: 'SEO_LOADING_SUCCESS',
  SEO_LOADING_ERROR: 'SEO_LOADING_ERROR',
  
  CLEAR_ERROR: 'CLEAR_ERROR',
  REFRESH_DATA: 'REFRESH_DATA'
};

// Reducer function
const landingPageReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOADING_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case actionTypes.LOADING_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
        lastFetch: Date.now()
      };
    
    case actionTypes.LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        // Use fallback data on error
        categories: state.categories.length > 0 ? state.categories : fallbackCategories,
        featuredProducts: state.featuredProducts.length > 0 ? state.featuredProducts : fallbackProducts,
        seoData: state.seoData || fallbackSEOData
      };
    
    case actionTypes.CATEGORIES_LOADING_START:
      return {
        ...state,
        categoriesLoading: true,
        categoriesError: null
      };
    
    case actionTypes.CATEGORIES_LOADING_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        categoriesLoading: false,
        categoriesError: null,
        categoriesLastFetch: Date.now()
      };
    
    case actionTypes.CATEGORIES_LOADING_ERROR:
      return {
        ...state,
        categoriesLoading: false,
        categoriesError: action.payload,
        categories: state.categories.length > 0 ? state.categories : fallbackCategories
      };
    
    case actionTypes.PRODUCTS_LOADING_START:
      return {
        ...state,
        productsLoading: true,
        productsError: null
      };
    
    case actionTypes.PRODUCTS_LOADING_SUCCESS:
      return {
        ...state,
        featuredProducts: action.payload,
        productsLoading: false,
        productsError: null,
        productsLastFetch: Date.now()
      };
    
    case actionTypes.PRODUCTS_LOADING_ERROR:
      return {
        ...state,
        productsLoading: false,
        productsError: action.payload,
        featuredProducts: state.featuredProducts.length > 0 ? state.featuredProducts : fallbackProducts
      };
    
    case actionTypes.SEO_LOADING_START:
      return {
        ...state,
        seoLoading: true,
        seoError: null
      };
    
    case actionTypes.SEO_LOADING_SUCCESS:
      return {
        ...state,
        seoData: action.payload,
        seoLoading: false,
        seoError: null,
        seoLastFetch: Date.now()
      };
    
    case actionTypes.SEO_LOADING_ERROR:
      return {
        ...state,
        seoLoading: false,
        seoError: action.payload,
        seoData: state.seoData || fallbackSEOData
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        categoriesError: null,
        productsError: null,
        seoError: null
      };
    
    case actionTypes.REFRESH_DATA:
      return {
        ...state,
        lastFetch: null,
        categoriesLastFetch: null,
        productsLastFetch: null,
        seoLastFetch: null
      };
    
    default:
      return state;
  }
};

// Provider component
export const LandingPageDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(landingPageReducer, initialState);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Check if data needs refresh
  const needsRefresh = useCallback((lastFetch) => {
    return !lastFetch || (Date.now() - lastFetch) > CACHE_DURATION;
  }, [CACHE_DURATION]);

  // Load all data
  const loadAllData = useCallback(async (force = false) => {
    if (!force && !needsRefresh(state.lastFetch)) {
      return; // Data is still fresh
    }

    dispatch({ type: actionTypes.LOADING_START });
    
    try {
      const [categoriesResult, productsResult, seoResult] = await Promise.allSettled([
        fetchCategories(),
        fetchFeaturedProducts(8),
        fetchSEOData()
      ]);

      const payload = {
        categories: categoriesResult.status === 'fulfilled' 
          ? categoriesResult.value 
          : fallbackCategories,
        featuredProducts: productsResult.status === 'fulfilled' 
          ? productsResult.value 
          : fallbackProducts,
        seoData: seoResult.status === 'fulfilled' 
          ? seoResult.value 
          : fallbackSEOData
      };

      dispatch({
        type: actionTypes.LOADING_SUCCESS,
        payload
      });
    } catch (error) {
      console.error('Failed to load landing page data:', error);
      dispatch({
        type: actionTypes.LOADING_ERROR,
        payload: error.message
      });
    }
  }, [state.lastFetch, needsRefresh]);

  // Load categories only
  const loadCategories = useCallback(async (force = false) => {
    if (!force && !needsRefresh(state.categoriesLastFetch)) {
      return;
    }

    dispatch({ type: actionTypes.CATEGORIES_LOADING_START });
    
    try {
      const categories = await fetchCategories();
      dispatch({
        type: actionTypes.CATEGORIES_LOADING_SUCCESS,
        payload: categories
      });
    } catch (error) {
      console.error('Failed to load categories:', error);
      dispatch({
        type: actionTypes.CATEGORIES_LOADING_ERROR,
        payload: error.message
      });
    }
  }, [state.categoriesLastFetch, needsRefresh]);

  // Load products only
  const loadProducts = useCallback(async (limit = 8, force = false) => {
    if (!force && !needsRefresh(state.productsLastFetch)) {
      return;
    }

    dispatch({ type: actionTypes.PRODUCTS_LOADING_START });
    
    try {
      const products = await fetchFeaturedProducts(limit);
      dispatch({
        type: actionTypes.PRODUCTS_LOADING_SUCCESS,
        payload: products
      });
    } catch (error) {
      console.error('Failed to load products:', error);
      dispatch({
        type: actionTypes.PRODUCTS_LOADING_ERROR,
        payload: error.message
      });
    }
  }, [state.productsLastFetch, needsRefresh]);

  // Load SEO data only
  const loadSEOData = useCallback(async (force = false) => {
    if (!force && !needsRefresh(state.seoLastFetch)) {
      return;
    }

    dispatch({ type: actionTypes.SEO_LOADING_START });
    
    try {
      const seoData = await fetchSEOData();
      dispatch({
        type: actionTypes.SEO_LOADING_SUCCESS,
        payload: seoData
      });
    } catch (error) {
      console.error('Failed to load SEO data:', error);
      dispatch({
        type: actionTypes.SEO_LOADING_ERROR,
        payload: error.message
      });
    }
  }, [state.seoLastFetch, needsRefresh]);

  // Clear errors
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  // Refresh all data
  const refreshData = useCallback(() => {
    dispatch({ type: actionTypes.REFRESH_DATA });
    loadAllData(true);
  }, [loadAllData]);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    loadAllData,
    loadCategories,
    loadProducts,
    loadSEOData,
    clearError,
    refreshData,
    
    // Utilities
    needsRefresh
  };

  return (
    <LandingPageContext.Provider value={contextValue}>
      {children}
    </LandingPageContext.Provider>
  );
};

// Custom hook to use the context
export const useLandingPageData = () => {
  const context = useContext(LandingPageContext);
  if (!context) {
    throw new Error('useLandingPageData must be used within LandingPageDataProvider');
  }
  return context;
};

// Export action types for testing
export { actionTypes };
