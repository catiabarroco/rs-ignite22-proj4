import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import {useRouter} from "next/router";
interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        defaultPriceId: string
    }
}
export default function Product({ product }: ProductProps) {
    const { isFallback } = useRouter();

    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);
    async function handleBuyButton() {
        try {
            setIsCreatingCheckoutSession(true);
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            })
            const { checkoutUrl } = response.data;
            window.location.href = checkoutUrl;
        } catch (err) {
            setIsCreatingCheckoutSession(false);
            alert('Falha ao redirecionar ao checkout!')
        }
    }

    if (isFallback) {
        return <h1>Loading</h1>;
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>

            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>

                    <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>
                        Buy now
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_NpKQDdzVuiEL6N' } },
        ],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<ProductProps,{ id: string }> = async ({ params }) => {
   const productId = params?.id;
   if (!productId){
       return {
           redirect: {
               destination: '/404',
               permanent: false
           }
       }
   }
try {
    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    });

    const price = product.default_price as Stripe.Price;
    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('US', {
                    style: 'currency',
                    currency: 'EUR',
                }).format((price?.unit_amount ?? 0) / 100),
                description: product.description ?? '',
                defaultPriceId: price.id,
            },
        },
        revalidate: 60 * 60 * 1, // 1 hours
    };
} catch {
    return {
        redirect: {
            destination: '/404',
            permanent: false
        }
    }
}
};