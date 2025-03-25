
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { initMercadoPago } from '../../../utils/mercadoPago';

export const useMercadoPago = () => {
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);
  const mercadoPagoRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  // Load MercadoPago SDK
  useEffect(() => {
    const loadMercadoPagoScript = () => {
      if (scriptLoaded.current) return;
      
      if (window.MercadoPago) {
        console.log('MercadoPago SDK already loaded');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        scriptLoaded.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        console.log('MercadoPago SDK loaded successfully');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        scriptLoaded.current = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
        toast.error("Falha ao carregar o processador de pagamento. Recarregue a página.");
        scriptLoaded.current = true;
      };
      
      document.body.appendChild(script);
    };

    loadMercadoPagoScript();
  }, []);

  return {
    mercadoPagoReady,
    mercadoPagoInstance: mercadoPagoRef.current
  };
};
