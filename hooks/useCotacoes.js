// hooks/useCotacoes.js
import { useState, useEffect } from 'react';

// Documentação:
// https://docs.awesomeapi.com.br/api-de-moedas
// Tem limitação de consultas
// const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';

// API de exemplo
// Sem limitação de consulta
const API_URL =
  'https://api.cotacoes.cloud.marcelomatos.dev/cotacoes.json';

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function buscarCotacoes() {
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error('Falha na requisição');
      }

      const dados = await resposta.json();

      setCotacoes({
        dolar: parseFloat(dados.USDBRL.bid),
        euro: parseFloat(dados.EURBRL.bid),
      });
    } catch (e) {
      console.log('Erro ao buscar cotações:', e);
      setErro('Não foi possível carregar as cotações.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // Busca assim que o componente é carregado
    buscarCotacoes();

    // Atualiza automaticamente a cada 10 segundos
    const intervalo = setInterval(() => {
      buscarCotacoes();
    }, 10 * 1000);

    // Para o intervalo quando o componente for desmontado
    return () => clearInterval(intervalo);
  }, []);

  return {
    cotacoes,
    carregando,
    erro,
    atualizar: buscarCotacoes,
  };
}