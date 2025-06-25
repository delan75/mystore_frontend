import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPageDataProvider, useLandingPageData } from '../../context/LandingPageContext';
import * as landingPageService from '../../services/landingPageService';

// Mock the service functions
jest.mock('../../services/landingPageService');

// Test component that uses the context
const TestComponent = () => {
  const {
    categories,
    featuredProducts,
    seoData,
    loading,
    error,
    loadCategories,
    loadProducts,
    refreshData
  } = useLandingPageData();

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="products-count">{featuredProducts.length}</div>
      <div data-testid="seo-title">{seoData?.title || 'No SEO Title'}</div>
      
      <button onClick={() => loadCategories(true)} data-testid="load-categories">
        Load Categories
      </button>
      <button onClick={() => loadProducts(8, true)} data-testid="load-products">
        Load Products
      </button>
      <button onClick={refreshData} data-testid="refresh-data">
        Refresh Data
      </button>
    </div>
  );
};

const renderWithProvider = (component) => {
  return render(
    <LandingPageDataProvider>
      {component}
    </LandingPageDataProvider>
  );
};

describe('LandingPageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides initial state correctly', () => {
    // Mock successful API calls
    landingPageService.fetchCategories.mockResolvedValue([
      { id: 1, name: 'Test Category', slug: 'test', is_active: true }
    ]);
    landingPageService.fetchFeaturedProducts.mockResolvedValue([
      { id: 1, name: 'Test Product', price: '10.00', images: [] }
    ]);
    landingPageService.fetchSEOData.mockResolvedValue({
      title: 'Test SEO Title'
    });

    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
  });

  test('loads data successfully', async () => {
    const mockCategories = [
      { id: 1, name: 'Vegetables', slug: 'vegetables', is_active: true },
      { id: 2, name: 'Fruits', slug: 'fruits', is_active: true }
    ];
    const mockProducts = [
      { id: 1, name: 'Tomatoes', price: '45.99', images: [] },
      { id: 2, name: 'Spinach', price: '32.50', images: [] }
    ];
    const mockSEOData = {
      title: 'Fresh Farm Products Online'
    };

    landingPageService.fetchCategories.mockResolvedValue(mockCategories);
    landingPageService.fetchFeaturedProducts.mockResolvedValue(mockProducts);
    landingPageService.fetchSEOData.mockResolvedValue(mockSEOData);

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('categories-count')).toHaveTextContent('2');
    expect(screen.getByTestId('products-count')).toHaveTextContent('2');
    expect(screen.getByTestId('seo-title')).toHaveTextContent('Fresh Farm Products Online');
  });

  test('handles API errors gracefully', async () => {
    landingPageService.fetchCategories.mockRejectedValue(new Error('API Error'));
    landingPageService.fetchFeaturedProducts.mockRejectedValue(new Error('API Error'));
    landingPageService.fetchSEOData.mockRejectedValue(new Error('API Error'));

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Should use fallback data when API fails
    expect(screen.getByTestId('categories-count')).not.toHaveTextContent('0');
    expect(screen.getByTestId('products-count')).not.toHaveTextContent('0');
  });

  test('allows manual data loading', async () => {
    const user = userEvent.setup();
    
    landingPageService.fetchCategories.mockResolvedValue([
      { id: 1, name: 'New Category', slug: 'new', is_active: true }
    ]);

    renderWithProvider(<TestComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click load categories button
    await act(async () => {
      await user.click(screen.getByTestId('load-categories'));
    });

    expect(landingPageService.fetchCategories).toHaveBeenCalledWith();
  });

  test('allows data refresh', async () => {
    const user = userEvent.setup();
    
    landingPageService.fetchCategories.mockResolvedValue([]);
    landingPageService.fetchFeaturedProducts.mockResolvedValue([]);
    landingPageService.fetchSEOData.mockResolvedValue({});

    renderWithProvider(<TestComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click refresh button
    await act(async () => {
      await user.click(screen.getByTestId('refresh-data'));
    });

    // Should call all fetch functions again
    expect(landingPageService.fetchCategories).toHaveBeenCalled();
    expect(landingPageService.fetchFeaturedProducts).toHaveBeenCalled();
    expect(landingPageService.fetchSEOData).toHaveBeenCalled();
  });

  test('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLandingPageData must be used within LandingPageDataProvider');

    consoleSpy.mockRestore();
  });
});
