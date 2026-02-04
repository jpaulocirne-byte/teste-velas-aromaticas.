
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { Product, CartItem, Order } from './types';
import { PRODUCTS, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Shipping Form States
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  // Admin Inbox State
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadAdminMessages = () => {
      const msgs = JSON.parse(localStorage.getItem('LUMINOUS_ADMIN_INBOX') || '[]');
      setAdminMessages(msgs);
    };
    loadAdminMessages();
    
    // Escuta mudanças no localStorage para atualizar o painel se estiver aberto
    window.addEventListener('storage', loadAdminMessages);
    return () => window.removeEventListener('storage', loadAdminMessages);
  }, [currentPage]);

  const ORIGIN_ADDRESS = "Rua Rui Costa, 520, CEP 58046-085, João Pessoa - PB";

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, selectedSize: product.size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Page Navigation Handlers
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  // Delivery Fee Logic
  const calculateFeeFromDistance = (distance: number) => {
    if (distance <= 5.0) return 4.00;
    if (distance <= 8.0) return 7.00;
    if (distance <= 12.0) return 10.00;
    return 14.00;
  };

  // CEP Search Logic
  const handleSearchCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsSearchingCep(true);
    setCalculatedDistance(null);
    setDeliveryFee(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado. Por favor, verifique o número digitado.');
      } else {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        const simulatedDist = parseFloat((Math.random() * 15 + 0.5).toFixed(1)); 
        setCalculatedDistance(simulatedDist);
        setDeliveryFee(calculateFeeFromDistance(simulatedDist));
      }
    } catch (error) {
      alert('Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.');
    } finally {
      setIsSearchingCep(false);
    }
  };

  // Render Functions
  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#D97706] via-[#F59E0B] to-[#D97706]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/10 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 font-bold animate-in fade-in slide-in-from-bottom-2 duration-1000 text-amber-50">Elegância em Cada Chama</p>
          <h1 className="text-5xl md:text-8xl font-serif mb-12 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 drop-shadow-sm">Ilumine Seus Melhores <br/> Momentos</h1>
          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <button onClick={() => handleNavigate('shop')} className="bg-white text-amber-900 px-12 py-5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-white transition-all duration-300 shadow-2xl w-fit">Explorar Coleção</button>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-amber-900 uppercase tracking-widest">Os Favoritos teste</h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.filter(p => p.isBestSeller).map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
              <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-white shadow-sm group-hover:shadow-xl transition-shadow duration-500 flex items-center justify-center p-4">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                {product.isNew && <span className="absolute top-4 left-4 bg-gold text-white text-[10px] uppercase tracking-widest px-3 py-1">Novo</span>}
              </div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-900 mb-1 font-medium">{product.name}</h3>
              <p className="text-gold font-serif text-lg">R$ {product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderShop = () => {
    const filteredProducts = activeCategory === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
    return (
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-4">
        <header className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">Exclusividade</p>
          <h1 className="text-4xl font-serif text-amber-900 mb-4 uppercase tracking-widest">Nossa Coleção</h1>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-[10px] uppercase tracking-widest px-6 py-2 border transition-all ${activeCategory === cat ? 'bg-gold border-gold text-white shadow-md' : 'border-gold/30 text-gold hover:border-gold'}`}>{cat}</button>
            ))}
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
               <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-white shadow-sm group-hover:shadow-lg transition-all duration-500 flex items-center justify-center p-4">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 border-[1px] border-amber-900/5 group-hover:border-gold/30 transition-colors m-2"></div>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 mb-1">{product.category}</p>
              <h3 className="text-sm uppercase tracking-widest text-amber-900 mb-1 font-medium group-hover:text-gold transition-colors">{product.name}</h3>
              <p className="text-gold font-serif text-lg">R$ {product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShipping = () => (
    <div className="py-20 max-w-6xl mx-auto px-4 animate-in fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-amber-900 mb-4 uppercase tracking-widest">Envio & Entrega</h1>
        <div className="w-16 h-[1px] bg-gold mx-auto mb-6"></div>
        <p className="text-sm text-amber-900/60 uppercase tracking-[0.2em] font-medium italic">Levamos o aconchego teste até você.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gold/10 p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gold/5 pb-8">
              <div className="w-16 h-16 bg-amber-soft rounded-full flex items-center justify-center text-gold border border-gold/20 flex-shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <h2 className="text-xl font-serif text-amber-900 uppercase tracking-widest mb-1">Centro de Distribuição</h2>
                <p className="text-[11px] text-amber-900/60 font-bold uppercase tracking-widest">{ORIGIN_ADDRESS}</p>
              </div>
            </div>

            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold mb-8 text-center">Cadastre seu Endereço</h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Endereço salvo com sucesso!'); }}>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold ml-1">CEP</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} className="flex-1 bg-cream/30 border-b border-gold/20 py-3 px-2 text-sm focus:outline-none focus:border-gold transition-all" required />
                  <button type="button" onClick={handleSearchCep} disabled={isSearchingCep} className="bg-gold text-white px-6 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-colors flex items-center gap-2"> {isSearchingCep ? '...' : 'Buscar'} </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold ml-1">Bairro</label>
                <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full bg-cream/30 border-b border-gold/20 py-3 px-2 text-sm focus:outline-none focus:border-gold transition-all" required />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold ml-1">Logradouro</label>
                <input type="text" placeholder="Rua, Avenida..." value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="w-full bg-cream/30 border-b border-gold/20 py-3 px-2 text-sm focus:outline-none focus:border-gold transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold ml-1">Número / Ap</label>
                <input type="text" placeholder="123..." value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full bg-cream/30 border-b border-gold/20 py-3 px-2 text-sm focus:outline-none focus:border-gold transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold ml-1">Complemento</label>
                <input type="text" placeholder="Opcional" value={referencia} onChange={(e) => setReferencia(e.target.value)} className="w-full bg-cream/30 border-b border-gold/20 py-3 px-2 text-sm focus:outline-none focus:border-gold transition-all" />
              </div>
              <div className="md:col-span-2 pt-6">
                <button type="submit" className="w-full bg-amber-900 text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-500 shadow-lg"> Confirmar Endereço </button>
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gold/10 p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gold/10">
               <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               <h3 className="text-xs uppercase tracking-widest font-bold text-amber-900">Taxa por Raio de Entrega</h3>
             </div>
             <div className="space-y-4 mb-10">
                {[ { range: "0 km - 5 km", price: "R$ 4,00" }, { range: "5 km - 8 km", price: "R$ 7,00" }, { range: "8 km - 12 km", price: "R$ 10,00" }, { range: "Acima de 12 km", price: "R$ 14,00", special: true }, ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] tracking-wider text-amber-900/70 border-b border-cream py-1">
                    <span className={row.special ? "text-gold font-bold" : ""}>{row.range}</span>
                    <span className="font-semibold text-amber-900">{row.price}</span>
                  </div>
                ))}
             </div>
             {calculatedDistance !== null && (
               <div className="bg-amber-soft p-6 border border-gold/20 text-center animate-in zoom-in duration-300">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-2">Entrega Estimada</p>
                 <div className="text-2xl font-serif text-amber-900 mb-1">R$ {deliveryFee?.toFixed(2).replace('.', ',')}</div>
                 <p className="text-[9px] text-amber-900/60 uppercase tracking-widest">Distância: {calculatedDistance} km</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminInbox = () => (
    <div className="py-20 max-w-5xl mx-auto px-6 animate-in fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-amber-900 mb-4 uppercase tracking-widest">Portal da Consultora</h1>
        <div className="w-16 h-[1px] bg-gold mx-auto mb-6"></div>
        <p className="text-xs text-gold uppercase tracking-[0.3em] font-bold">Inbox de Consultoria teste</p>
      </div>

      <div className="bg-white border border-gold/10 shadow-2xl overflow-hidden rounded-sm">
        <div className="bg-amber-soft/50 p-6 border-b border-gold/10 flex justify-between items-center">
           <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900">Mensagens Recebidas ({adminMessages.length})</h3>
           <button 
             onClick={() => { localStorage.removeItem('LUMINOUS_ADMIN_INBOX'); setAdminMessages([]); }}
             className="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-600 font-bold"
           >
             Limpar Inbox
           </button>
        </div>
        <div className="divide-y divide-gold/5">
          {adminMessages.length === 0 ? (
            <div className="py-20 text-center text-amber-900/30 italic uppercase text-[10px] tracking-widest">Sua inbox está vazia no momento.</div>
          ) : adminMessages.map((msg) => (
            <div key={msg.id} className="p-8 hover:bg-cream/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                    <span className="text-[10px] uppercase font-bold text-amber-900/40 tracking-widest">{msg.date}</span>
                 </div>
                 <p className="text-amber-900 text-sm italic font-serif leading-relaxed">"{msg.text}"</p>
               </div>
               <div className="flex gap-4">
                 <button className="bg-gold text-white px-6 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all">Atender</button>
                 <button className="border border-gold text-gold px-6 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-gold hover:text-white transition-all">Arquivar</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="py-20 max-w-4xl mx-auto px-6 animate-in fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-amber-900 mb-4 uppercase tracking-widest">Privacidade</h1>
        <div className="w-16 h-[1px] bg-gold mx-auto mb-6"></div>
        <p className="text-xs text-gold uppercase tracking-[0.3em] font-bold italic">Sua confiança é nossa fragrância mais valiosa.</p>
      </div>
      <div className="prose prose-amber max-w-none space-y-12 text-amber-900/80 leading-relaxed text-sm">
        <section className="bg-white p-10 border border-gold/10 shadow-sm">
          <h2 className="text-2xl font-serif text-amber-900 uppercase tracking-widest mb-6 border-b border-gold/5 pb-4">1. Coleta de Informações</h2>
          <p> Na teste, coletamos apenas os dados essenciais para proporcionar uma experiência de compra sofisticada e segura. Isso inclui seu nome, e-mail e endereço de entrega (necessário para nossas entregas em toda João Pessoa). Seus dados são tratados com o máximo rigor de confidencialidade. </p>
        </section>
        <section className="bg-white p-10 border border-gold/10 shadow-sm">
          <h2 className="text-2xl font-serif text-amber-900 uppercase tracking-widest mb-6 border-b border-gold/5 pb-4">2. Uso dos Dados</h2>
          <p> Utilizamos suas informações exclusivamente para processar seus pedidos e garantir a entrega pontual. </p>
        </section>
        <div className="text-center pt-8 border-t border-gold/10">
          <p className="text-[10px] uppercase tracking-widest text-amber-900/40">Última atualização: Fevereiro de 2024</p>
          <button onClick={() => handleNavigate('home')} className="mt-8 text-gold text-[10px] uppercase tracking-[0.3em] font-bold border-b border-gold/40 hover:text-amber-900 hover:border-amber-900 transition-all">Voltar ao Início</button>
        </div>
      </div>
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <div className="aspect-[3/4] bg-white overflow-hidden shadow-2xl border border-gold/10 flex items-center justify-center p-8">
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-10">
            <div>
              <nav className="flex text-[10px] uppercase tracking-widest text-amber-900/40 mb-6">
                <span className="cursor-pointer hover:text-gold transition-colors" onClick={() => handleNavigate('shop')}>Coleção</span>
                <span className="mx-3">/</span>
                <span className="text-amber-900">{selectedProduct.category}</span>
              </nav>
              <h1 className="text-5xl font-serif text-amber-900 mb-4">{selectedProduct.name}</h1>
              <p className="text-3xl text-gold font-serif">R$ {selectedProduct.price.toFixed(2)}</p>
            </div>
            <div className="prose prose-sm text-amber-900/70 max-w-none border-l-2 border-gold/20 pl-6 italic">
              <p className="leading-relaxed">{selectedProduct.description}</p>
            </div>
            <button onClick={() => addToCart(selectedProduct)} className="w-full bg-amber-900 text-white py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500 shadow-lg">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in">
      <h1 className="text-4xl font-serif text-amber-900 mb-12 uppercase tracking-widest">Meu Perfil</h1>
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1 border-r border-gold/10 pr-8">
          <div className="w-24 h-24 bg-gold/10 rounded-full mx-auto flex items-center justify-center text-gold text-3xl font-serif mb-4 border border-gold/20">M</div>
          <div className="text-center">
            <h2 className="text-lg font-serif text-amber-900 uppercase tracking-widest">Mariana Silveira</h2>
            <nav className="flex flex-col space-y-4 mt-8">
              <button className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold text-left border-b border-gold/10 pb-2">Meus Pedidos</button>
              <button onClick={() => handleNavigate('shipping')} className="text-[10px] uppercase tracking-[0.2em] text-amber-900/60 text-left hover:text-gold transition-colors">Endereços de Entrega</button>
              <button onClick={() => handleNavigate('admin-inbox')} className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold text-left pt-10">Painel de Consultora</button>
            </nav>
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-8 border-b border-gold/10 pb-4">Histórico de Experiências</h3>
          <div className="text-center py-20 bg-cream/50 border border-dashed border-gold/30 rounded-sm italic text-amber-900/40 text-xs tracking-widest">Nenhum pedido encontrado.</div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in">
      <div className="h-[60vh] relative flex items-center justify-center text-center px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=1920" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10">
          <h1 className="text-6xl font-serif text-amber-900 mb-4 uppercase tracking-tighter">Sobre a teste</h1>
          <p className="text-xs uppercase tracking-[0.5em] text-gold font-semibold">A Ciência da Calma e a Arte da Chama</p>
        </div>
      </div>
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1920" alt="Processo" className="w-full h-full object-cover opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream opacity-80"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl font-serif text-amber-900 mb-6 uppercase tracking-widest">Nossa Origem</h2>
          <p className="text-amber-900/80 leading-relaxed text-sm max-w-2xl mx-auto">Nascemos da busca pelo equilíbrio em um mundo veloz. Criamos âncoras sensoriais que ajudam você a desacelerar e habitar o momento presente. Cada fragrância conta uma história.</p>
        </div>
      </section>
    </div>
  );

  const renderCheckout = () => (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-in fade-in">
      <h1 className="text-4xl font-serif text-amber-900 mb-12 uppercase tracking-widest">Finalizar Pedido</h1>
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-16">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-8 border-b border-gold/10 pb-4">Pagamento</h3>
            <div className="space-y-4">
              <label className="flex items-center p-6 border border-gold/10 cursor-pointer hover:bg-cream/50 transition-all">
                <input type="radio" name="payment" className="mr-4 accent-gold w-4 h-4" defaultChecked />
                <span className="text-sm text-amber-900 font-semibold tracking-widest uppercase">Cartão / Pix</span>
              </label>
            </div>
          </section>
          <button onClick={() => { alert('Pedido realizado!'); setCart([]); handleNavigate('home'); }} className="w-full bg-amber-900 text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-500 shadow-xl">Confirmar - R$ {(cartTotal + (deliveryFee || 0)).toFixed(2)}</button>
        </div>
        <div className="bg-amber-soft/40 p-10 h-fit sticky top-28 border border-gold/10">
           <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-10 border-b border-gold/20 pb-4">Sacola teste</h3>
           <div className="space-y-8 mb-10">
             {cart.map(item => (
               <div key={item.product.id} className="flex gap-6">
                 <img src={item.product.images[0]} className="w-24 h-24 object-contain border border-gold/10 bg-white p-1" />
                 <div className="flex-1 flex flex-col justify-center">
                   <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-900 font-bold">{item.product.name}</h4>
                   <p className="text-sm text-gold font-serif">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                 </div>
               </div>
             ))}
             {deliveryFee !== null && (
                <div className="flex justify-between items-center pt-4 border-t border-gold/20">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Frete (Jampa)</span>
                  <span className="text-gold font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-grow bg-cream">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'shop' && renderShop()}
        {currentPage === 'product-detail' && renderProductDetail()}
        {currentPage === 'profile' && renderProfile()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'checkout' && renderCheckout()}
        {currentPage === 'shipping' && renderShipping()}
        {currentPage === 'privacy' && renderPrivacy()}
        {currentPage === 'admin-inbox' && renderAdminInbox()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <ChatBot />
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-cream h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
             <div className="p-10 border-b border-gold/10 flex justify-between items-center bg-amber-soft/20">
               <h2 className="text-3xl font-serif text-amber-900">Minha Sacola</h2>
               <button onClick={() => setIsCartOpen(false)} className="text-amber-900/40 hover:text-gold transition-all">Fechar</button>
             </div>
             <div className="flex-1 overflow-y-auto p-10 space-y-10">
               {cart.length === 0 ? <p className="text-center italic opacity-40">Vazia</p> : cart.map(item => (
                 <div key={item.product.id} className="flex gap-6 items-center">
                   <img src={item.product.images[0]} className="w-20 h-20 object-contain" />
                   <div>
                     <h4 className="text-xs uppercase font-bold">{item.product.name}</h4>
                     <p className="text-gold">R$ {item.product.price.toFixed(2)}</p>
                   </div>
                 </div>
               ))}
             </div>
             {cart.length > 0 && <div className="p-10 bg-amber-soft/30 border-t border-gold/10"><button onClick={() => { setIsCartOpen(false); handleNavigate('checkout'); }} className="w-full bg-amber-900 text-white py-5 font-bold uppercase tracking-widest">Finalizar</button></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
