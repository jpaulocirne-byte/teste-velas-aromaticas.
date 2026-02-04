
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luminous Gold Dust',
    price: 95.0,
    description:
      'Onde o aroma encontra o requinte. Velas artesanais com acabamento sofisticado e folhas de ouro, criadas para transformar ambientes em experiências.',
    category: 'Amadeirado',
    images: [
      'https://i.ibb.co/v6c2FWmr/64b0be51-7f15-41ed-bdeb-9a02d9da7c90.jpg'
    ],
    aroma: 'Sândalo, Âmbar e Madeira de Cedro',
    size: 'Média',
    weight: '210g',
    burnTime: '38 horas',
    isBestSeller: true,
    reviews: []
  },
  {
    id: '2',
    name: 'Amor em Cores',
    price: 85.0,
    description:
      'Uma explosão de doçura e carinho. Esta vela apresenta corações de cera coloridos esculpidos à mão, flutuando em uma base de baunilha cremosa.',
    category: 'Doce',
    images: [
      'https://i.ibb.co/b5NtTgsY/8c79dbf3-10e8-4834-861d-3de4c301570f.jpg'
    ],
    aroma: 'Marshmallow, Baunilha e Framboesa',
    size: 'Média',
    weight: '190g',
    burnTime: '32 horas',
    isNew: true,
    reviews: []
  },
  {
    id: '3',
    name: 'Champagne Toast',
    price: 98.0,
    description:
      'Elegância em forma de chama. Com uma rosa de cera esculpida no topo, esta vela celebra momentos especiais com um aroma efervescente e luxuoso.',
    category: 'Fresco',
    images: [
      'https://i.ibb.co/n8tCJDnL/69da8235-779c-4037-be88-94eda152a1dd.jpg'
    ],
    aroma: 'Champagne, Nectarina e Groselha Branca',
    size: 'Média',
    weight: '200g',
    burnTime: '35 horas',
    isBestSeller: true,
    reviews: []
  },
  {
    id: '4',
    name: 'Cereja e Avelã',
    price: 89.0,
    description:
      'Doce no aroma, linda no visual🍒💗 Nossa vela Cereja & Avelã é perfeita para presentear ou se presentear. ✨ Estoque limitado',
    category: 'Doce',
    images: [
      'https://i.ibb.co/mF5gPHSN/f11cd666-a7f2-4d8d-8bcd-872ca94a71a5.jpg'
    ],
    aroma: 'Cereja Negra, Avelã Tostada e Caramelo',
    size: 'Média',
    weight: '200g',
    burnTime: '35 horas',
    reviews: []
  },
  {
    id: '5',
    name: 'Velas Botanic Premium',
    price: 100.0,
    description:
      'A joia da nossa coleção. Uma vela de grande porte apresentada em uma redoma de vidro clássica, exalando um frescor floral que transforma ambientes.',
    category: 'Floral',
    images: [
      'https://i.ibb.co/bgZYJ4LG/01649fab-f079-402e-bdab-df06cd2791bb.jpg'
    ],
    aroma: 'Orquídea Branca, Lírio do Vale e Musgo',
    size: 'Grande',
    weight: '400g',
    burnTime: '65 horas',
    isBestSeller: true,
    reviews: []
  },
  {
    id: '6',
    name: 'Rosa Esculpida',
    price: 92.0,
    description:
      'Uma escultura em cera no formato de rosa. Tão bela que você hesitará em acendê-la. Uma peça de perfumaria fina.',
    category: 'Floral',
    images: [
      'https://i.ibb.co/ZpSCbnmg/fbc2042d-8b8e-44c6-8dd3-c9712e564f8a.jpg'
    ],
    aroma: 'Rosas de Maio, Peônia e Musk',
    size: 'Pequena',
    weight: '150g',
    burnTime: '25 horas',
    isNew: true,
    reviews: []
  },
  {
    id: '7',
    name: 'Pôr do Sol em Capri',
    price: 105.0,
    description:
      '✨ Elegância que se sente no ar ✨Nossa vela Botanic em cúpula é a união perfeita entre sofisticação e aconchego.um design atemporal, que decora com delicadeza e perfuma o ambiente de forma suave e envolvente.',
    category: 'Cítrico',
    images: [
      'https://i.ibb.co/zHQH5ym4/Captura-de-tela-2026-02-04-124820.png'
    ],
    aroma: 'Botanic em cúpula',
    size: 'Grande',
    weight: '350g',
    burnTime: '55 horas',
    isNew: true,
    reviews: []
  }
];

export const CATEGORIES = [
  'Todos',
  'Floral',
  'Amadeirado',
  'Cítrico',
  'Doce',
  'Fresco'
];
