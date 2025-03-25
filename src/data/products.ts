
import { ProductInfo } from '../hooks/useProductSelection';

export const productsList: ProductInfo[] = [
  {
    id: 0,
    title: "Pelúcia Stitch",
    price: "R$ 0,99",
    originalPrice: "R$ 199,99",
    description: "Pelúcia oficial Disney do Stitch em azul super macia. O famoso Experimento 626 com detalhes perfeitos para os fãs.",
    imageUrl: "/lovable-uploads/ab25fdf7-5c56-4558-96da-9754bee039be.png",
    size: "20 cm",
    discount: "99% OFF",
    quantity: 1
  },
  {
    id: 1,
    title: "Óculos Stitch",
    price: "R$ 129,99",
    originalPrice: "R$ 185,70",
    description: "Óculos de sol temáticos do Stitch com proteção UV400. Design exclusivo e divertido para todas as idades.",
    imageUrl: "/lovable-uploads/6f89d2fc-034b-404b-8125-04eff3980aac.png",
    size: "1 unidade",
    discount: "30% OFF",
    quantity: 1
  },
  {
    id: 2,
    title: "Kit Completo Stitch",
    price: "R$ 399,99",
    originalPrice: "R$ 571,40",
    description: "Kit completo com pelúcia Stitch, garrafa térmica e óculos de sol. O presente perfeito para os fãs de Lilo & Stitch.",
    imageUrl: "/lovable-uploads/1c4608df-7348-4fa2-98f9-0c546b5c8895.png",
    size: "Kit Completo",
    discount: "30% OFF",
    additionalInfo: "Contém 1 pelúcia, 1 óculos e 1 garrafa",
    quantity: 1
  }
];
