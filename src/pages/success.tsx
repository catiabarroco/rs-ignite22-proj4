import Link from "next/link";
import { ImageContainer, SuccessContainer } from "../styles/pages/success";

export default function Success() {
    return (
        <SuccessContainer>
            <h1>Compra efetuada</h1>

            <ImageContainer>

            </ImageContainer>

            <p>
                Uhuul <strong>Diego Fernandes</strong>, sua <strong>Camiseta Beyond the Limits</strong> já está a caminho da sua casa.
            </p>

            <Link href="/Users/catiabarroco/Developer/CatiaPessoal/rs-ignite22-proj4/src/pages">
                Voltar ao catálogo
            </Link>
        </SuccessContainer>
    )
}