import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, ChevronsRight, Loader2 } from 'lucide-react';

// Define the action creator locally (since the reducer logic is in the host)
const setSelectedCard = (id) => ({ type: 'SET_SELECTED_CARD', payload: id });

const CreditCardMFE = () => {
  const dispatch = useDispatch();
  // State is read from the shared Redux store provided by the Host
  const cards = useSelector(state => state.banking.cards);
  const selectedCardId = useSelector(state => state.banking.selectedCardId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCardSelect = (id) => {
    // Action dispatched to shared store, consumed by OnlineBankingMFE
    dispatch(setSelectedCard(id));
  };

  const CardItem = ({ card }) => {
    const isSelected = card.id === selectedCardId;
    const balance = card.balance.toFixed(2);
    const available = (card.limit - card.balance).toFixed(2);
    const usagePercentage = (card.balance / card.limit) * 100;
    
    let balanceClass = 'balance-green'; // Default
    if (usagePercentage > 50) balanceClass = 'balance-yellow';
    if (usagePercentage > 80) balanceClass = 'balance-red';

    return (
      <div
        key={card.id}
        onClick={() => handleCardSelect(card.id)}
        className={`card-item ${isSelected ? 'card-item-selected' : 'card-item-default'}`}
      >
        <div className="card-header">
          <h3 className="card-name">{card.name}</h3>
          {isSelected && <ChevronsRight className="card-selected-icon" size={20} />}
        </div>
        <p className={`card-balance ${isSelected ? balanceClass : 'card-balance-default'}`}>
          ${balance}
        </p>
        <p className={`card-available-label ${isSelected ? 'text-white-300' : 'text-indigo-500'}`}>
          Available Credit: ${available}
        </p>
      </div>
    );
  };

  return (
    <>
        <style>
            {`
            .cc-mfe-container {
                background-color: #fff;
                padding: 1.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
                border-radius: 0.75rem; /* rounded-xl */
                border: 1px solid #e0e7ff; /* border-indigo-100 */
                flex: 1; /* flex-1 */
                min-width: 300px;
            }
            .mfe-title {
                font-size: 1.25rem; /* xl */
                font-weight: 700; /* bold */
                color: #3730a3; /* indigo-800 */
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
            }
            .mfe-icon {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
                color: #6366f1; /* indigo-500 */
            }
            .mfe-info {
                font-size: 0.875rem; /* sm */
                color: #6b7280; /* gray-500 */
                margin-bottom: 1rem;
            }
            .loading-state {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 12rem; /* h-48 */
            }
            .loading-spinner {
                width: 2rem;
                height: 2rem;
                animation: spin 1s linear infinite;
                color: #6366f1; /* indigo-500 */
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Card Item Styling */
            .card-item {
                padding: 1rem;
                margin-bottom: 0.75rem;
                border-radius: 0.75rem; /* rounded-xl */
                cursor: pointer;
                transition: transform 0.3s, background-color 0.3s;
            }
            .card-item:hover {
                transform: scale(1.02);
            }
            .card-item-default {
                background-color: #e0e7ff; /* indigo-100 */
                color: #3730a3; /* indigo-900 */
            }
            .card-item-default:hover {
                background-color: #c7d2fe; /* indigo-200 */
            }
            .card-item-selected {
                background-color: #4338ca; /* indigo-700 */
                color: #fff;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1); /* shadow-lg */
                border: 4px solid #a5b4fc; /* ring-4 ring-indigo-300 */
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .card-name {
                font-size: 1.125rem; /* lg */
                font-weight: 700; /* bold */
            }
            .card-selected-icon {
                color: #fff;
            }
            .card-balance {
                font-size: 1.5rem; /* 2xl */
                font-weight: 800; /* extrabold */
                margin-top: 0.25rem;
            }
            .card-balance-default {
                color: #3730a3; /* indigo-900 */
            }

            /* Dynamic Balance Colors */
            .balance-green { color: #86efac; } /* green-300 */
            .balance-yellow { color: #fde047; } /* yellow-300 */
            .balance-red { color: #fca5a5; } /* red-300 */
            
            .card-available-label {
                font-size: 0.75rem; /* xs */
                color: #a5b4fc; /* indigo-300 when selected */
            }
            .card-item-default .card-available-label {
                color: #6366f1; /* indigo-500 when default */
            }
            `}
        </style>

        <div className="cc-mfe-container">
            <h2 className="mfe-title">
                <CreditCard className="mfe-icon" size={20} />
                Credit Card MFE (Remote App)
            </h2>

            {loading ? (
                <div className="loading-state">
                    <Loader2 className="loading-spinner" size={32} />
                </div>
            ) : (
                <div className="space-y-4">
                    {cards.map(card => <CardItem key={card.id} card={card} />)}
                </div>
            )}
        </div>
    </>
  );
};

export default CreditCardMFE;
