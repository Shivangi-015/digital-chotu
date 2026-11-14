type BackendBrand = {
  id: string
  name: string
}

type BackendCategory = {
  id: string
  name: string
}

type BackendVariant = {
  variantName: string
  price: number
  stockQuantity: number
}

type BackendProduct = {
  name: string
  brand: BackendBrand
  category: BackendCategory
  variants: BackendVariant[]
}

export async function fetchCatalog() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${backendUrl}/api/products`);

  if (!response.ok) {
    throw new Error('Failed to fetch catalog')
  }

  const products = (await response.json()) as BackendProduct[]

  return products.map((product) => ({
    name: product.name,
    brand: product.brand.name,
    category: product.category.name,
    variants: product.variants.map((variant) => ({
  variantName:
    variant.variantName === "70 g"
        ? "1 packet"
        : variant.variantName,

    price: variant.price,
    stockQuantity: variant.stockQuantity,
  })),
  }))
}
