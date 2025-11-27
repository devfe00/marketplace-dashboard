import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { getPlans, createPaymentLink } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await getPlans();
      setPlans(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setProcessingPlan(planId);
    try {
      const response = await createPaymentLink(planId);
      window.location.href = response.data.data.paymentLink;
    } catch (error) {
      alert('Erro ao gerar link de pagamento: ' + error.response?.data?.error);
      setProcessingPlan(null);
    }
  };

  const planFeatures = {
    starter: [
      'Até 50 produtos',
      'Registro de vendas',
      'Dashboard com métricas',
      'Notificações inteligentes',
      'Suporte por email',
    ],
    growth: [
      'Até 200 produtos',
      'Todas as funcionalidades do Starter',
      'Analytics completo',
      'Exportar relatórios Excel',
      'Histórico de vendas detalhado',
      'Suporte prioritário',
    ],
    pro: [
      'Produtos ilimitados',
      'Todas as funcionalidades do Growth',
      'Notificações via WhatsApp',
      'API de integração',
      'Backup automático',
      'Suporte VIP 24/7',
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando planos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-gray-600">
            Planos simples e acessíveis para pequenos empreendedores
          </p>
          {user && (
            <p className="mt-4 text-green-600 font-semibold">
              Plano atual: {user.plan === 'free' ? 'FREE (10 produtos)' : user.plan.toUpperCase()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                plan.id === 'growth' ? 'ring-4 ring-green-500 transform scale-105' : ''
              }`}
            >
              {plan.id === 'growth' && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>MAIS POPULAR</span>
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h2>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-600">/mês</span>
              </div>

              <ul className="space-y-3 mb-8">
                {planFeatures[plan.id]?.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingPlan === plan.id || user?.plan === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.id === 'growth'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                {processingPlan === plan.id
                  ? 'Processando...'
                  : user?.plan === plan.id
                  ? 'Plano Atual'
                  : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Pagamento 100% seguro via Mercado Pago</p>
          <p>Cancele quando quiser, sem multas ou taxas</p>
        </div>
      </div>
    </div>
  );
}