'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Mail, 
  ExternalLink, 
  PlusCircle, 
  DollarSign, 
  Truck, 
  Carrot, 
  Users, 
  TrendingUp, 
  MailOpen, 
  ShoppingCart, 
  List, 
  Edit3, 
  Trash2, 
  X,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Modal CRUD state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formProductId, setFormProductId] = useState('');
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('fruits');
  const [formPrice, setFormPrice] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formImage, setFormImage] = useState('assets/peaches.png');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formCarbs, setFormCarbs] = useState('');
  const [formFiber, setFormFiber] = useState('');
  const [formProtein, setFormProtein] = useState('');

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProducts, resOrders, resSubscribers] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/newsletter').then(r => r.json())
      ]);
      setProducts(resProducts);
      setOrders(resOrders);
      setSubscribers(resSubscribers);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // calculations
  const grossRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const dispatchedCount = orders.length;

  const handleOpenModal = (mode, prod = null) => {
    setModalMode(mode);
    if (mode === 'create') {
      setFormProductId('');
      setFormName('');
      setFormCategory('fruits');
      setFormPrice('');
      setFormTag('');
      setFormImage('assets/peaches.png');
      setFormShortDesc('');
      setFormLongDesc('');
      setFormCalories('');
      setFormCarbs('');
      setFormFiber('');
      setFormProtein('');
    } else if (mode === 'edit' && prod) {
      setFormProductId(prod.id);
      setFormName(prod.name);
      setFormCategory(prod.category);
      setFormPrice(prod.price);
      setFormTag(prod.tag || '');
      setFormImage(prod.image);
      setFormShortDesc(prod.shortDesc);
      setFormLongDesc(prod.longDesc);
      setFormCalories(prod.nutrition?.calories || '');
      setFormCarbs(prod.nutrition?.carbs || '');
      setFormFiber(prod.nutrition?.fiber || '');
      setFormProtein(prod.nutrition?.protein || '');
    }
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formName,
      category: formCategory,
      price: parseFloat(formPrice),
      tag: formTag,
      image: formImage,
      shortDesc: formShortDesc,
      longDesc: formLongDesc,
      nutrition: {
        calories: formCalories || 'N/A',
        carbs: formCarbs || 'N/A',
        fiber: formFiber || 'N/A',
        protein: formProtein || 'N/A'
      }
    };

    try {
      let res;
      if (modalMode === 'edit') {
        res = await fetch(`/api/products/${formProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this catalog product? This change will reflect on the client shop instantly.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Custom Interactive SVG Area Chart Calculation
  const renderSvgChart = () => {
    if (orders.length === 0) return null;

    const chronOrders = [...orders].reverse();
    let totalSales = 0;
    const points = [{ label: 'Launch', value: 0 }];
    
    chronOrders.forEach(o => {
      totalSales += o.total;
      points.push({
        label: `#${o.id.split('-')[1]}`,
        value: totalSales
      });
    });

    const maxVal = Math.max(...points.map(p => p.value)) || 100;
    const chartHeight = 180;
    const chartWidth = 500;
    const padding = 20;

    const coords = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - (p.value / maxVal) * (chartHeight - padding * 2);
      return { x, y, ...p };
    });

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${coords[0].x} ${chartHeight - padding} Z`;

    return (
      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.1)" />

          {/* Area fill */}
          <path d={areaPath} fill="url(#chart-gradient)" opacity="0.15" />
          {/* Main path line */}
          <path d={linePath} fill="none" stroke="#d4af37" strokeWidth="2.5" />

          {/* Data Points */}
          {coords.map((c, idx) => (
            <g key={idx} className="group/point cursor-pointer">
              <circle 
                cx={c.x} 
                cy={c.y} 
                r="4" 
                fill="#d4af37" 
                stroke="#111827" 
                strokeWidth="1.5" 
                className="hover:r-6 transition-all"
              />
              <title>{`${c.label}: $${c.value.toFixed(2)}`}</title>
            </g>
          ))}

          {/* Definitions */}
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#070a13] text-gray-100 flex font-sans relative overflow-x-hidden selection:bg-accent/30 selection:text-white">
      {/* Background ambient lighting glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-accent/8 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar navigation */}
      <aside className="w-[260px] border-r border-yellow-500/10 bg-slate-950/85 backdrop-blur px-6 py-8 flex flex-col justify-between hidden lg:flex relative z-10 shrink-0 h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-3 mb-10 text-gray-100 decoration-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#e5c158] to-[#ab851e] rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 text-[#0b0f19] shrink-0">
              <Sprout className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <h1 className="font-heading text-base font-bold tracking-wide">Sahara Garden</h1>
              <span className="text-[0.65rem] tracking-[2px] uppercase text-accent font-medium block">Command Panel</span>
            </div>
          </div> 

          <ul className="flex flex-col gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders Log', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'catalog', label: 'Catalog Manager', icon: <Package className="w-4 h-4" /> },
              { id: 'subscribers', label: 'Newsletter List', icon: <Mail className="w-4 h-4" /> }
            ].map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`${tab.id}-panel`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl border border-transparent transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-gray-100 bg-accent/8 border-yellow-500/15 border-l-4 !border-l-accent shadow'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-yellow-500/10 pt-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-accent to-green-500 flex items-center justify-center font-bold text-[#0b0f19] border border-white/10 shrink-0">
              AH
            </div>
            <div>
              <div className="text-xs font-bold">Al-amin Hasan</div>
              <div className="text-[0.65rem] text-gray-400">System Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard content panel */}
      <main className="flex-grow p-6 sm:p-10 relative z-10 overflow-y-auto h-screen text-left">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading bg-gradient-to-r from-gray-100 to-accent bg-clip-text text-transparent">
              Dashboard Command Center
            </h2>
            <p className="text-xs text-gray-400 mt-1">Real-time shop intelligence and agricultural supply-chain logistics</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/"
              target='_blank' 
              className="inline-flex items-center gap-2 bg-white/5 border border-yellow-500/10 hover:border-accent text-xs sm:text-sm text-gray-100 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Visit Consumer Store
            </Link>
            <button 
              onClick={() => handleOpenModal('create')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-yellow-600 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 text-xs sm:text-sm text-[#0b0f19] px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Gross Revenue', value: `$${grossRevenue.toFixed(2)}`, icon: <DollarSign className="w-6 h-6" /> },
            { label: 'Dispatched Orders', value: dispatchedCount, icon: <Truck className="w-6 h-6" /> },
            { label: 'Catalog Items', value: products.length, icon: <Carrot className="w-6 h-6" /> },
            { label: 'Subscribers', value: subscribers.length, icon: <Users className="w-6 h-6" /> }
          ].map((metric, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/70 border border-yellow-500/10 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden transition-all hover:border-accent hover:-translate-y-1 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-accent before:opacity-60"
            >
              <div>
                <h3 className="text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold mb-2">{metric.label}</h3>
                <span className="text-2xl font-bold font-heading text-gray-100">{metric.value}</span>
              </div>
              <div className="w-12 h-12 bg-accent/10 border border-yellow-500/10 rounded-xl flex items-center justify-center text-accent">
                {metric.icon}
              </div>
            </div>
          ))}
        </section>

        {/* Charts & Newsletter Feed Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10" id="overview-panel">
          <div className="lg:col-span-2 bg-slate-900/70 border border-yellow-500/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2 mb-6 border-b border-white/5 pb-3 font-heading">
              <TrendingUp className="text-accent w-4 h-4" /> Sales Velocity Chart
            </h3>
            {loading ? (
              <div className="h-[180px] flex items-center justify-center text-gray-400 animate-pulse text-xs">Loading chart data...</div>
            ) : (
              renderSvgChart()
            )}
          </div>

          {/* Subscribers Panel */}
          <div className="bg-slate-900/70 border border-yellow-500/10 rounded-2xl p-6 shadow-lg flex flex-col h-full" id="subscribers-panel">
            <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2 mb-6 border-b border-white/5 pb-3 font-heading text-left">
              <MailOpen className="text-accent w-4 h-4" /> Harvest Bulletin List
            </h3>
            <div className="overflow-y-auto max-h-[190px] pr-1 flex flex-col gap-2">
              {subscribers.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-12">No newsletter subscribers recorded.</p>
              ) : (
                subscribers.map((sub, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-left hover:bg-white/6 transition-colors">
                    <span className="text-xs font-semibold text-gray-200 truncate max-w-[150px]">{sub.email}</span>
                    <span className="text-[0.65rem] text-gray-400 font-medium">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Real-Time Order Log */}
        <section className="bg-slate-900/70 border border-yellow-500/10 rounded-2xl p-6 shadow-lg mb-10" id="orders-panel">
          <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2 mb-6 border-b border-white/5 pb-3 font-heading">
            <ShoppingCart className="text-accent w-4 h-4" /> Real-Time Order Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-yellow-500/10">
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Invoice ID</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Date</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Items Ordered</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Grand Total</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Dispatch Status</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-xs text-gray-400">No order invoices recorded. Complete checking out in store to seed the dashboard log!</td>
                  </tr>
                ) : (
                  orders.map(order => {
                    const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const itemsStr = order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ');

                    return (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold font-heading text-accent text-sm">{order.id}</td>
                        <td className="p-4 text-xs text-gray-300">{date}</td>
                        <td className="p-4 text-xs text-gray-300 max-w-[200px] truncate" title={itemsStr}>{itemsStr}</td>
                        <td className="p-4 text-xs font-semibold text-gray-200">${order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase border ${
                            order.status === 'Pending' 
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/25' 
                              : order.status === 'Dispatching' 
                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/25' 
                                : 'bg-green-500/10 text-green-500 border-green-500/25'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.status === 'Pending' ? (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'Dispatching')}
                              className="inline-flex items-center gap-1 bg-white/5 hover:bg-accent hover:text-slate-950 border border-yellow-500/10 px-2.5 py-1 rounded text-xs font-semibold tracking-wide cursor-pointer transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" /> Dispatch
                            </button>
                          ) : order.status === 'Dispatching' ? (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                              className="inline-flex items-center gap-1 bg-white/5 border border-green-500/20 hover:bg-green-500 hover:text-slate-950 px-2.5 py-1 rounded text-xs font-semibold tracking-wide cursor-pointer transition-colors text-green-400"
                            >
                              <Check className="w-3.5 h-3.5" /> Deliver
                            </button>
                          ) : (
                            <span className="text-[0.65rem] font-semibold text-gray-500">Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Catalog CRUD Table */}
        <section className="bg-slate-900/70 border border-yellow-500/10 rounded-2xl p-6 shadow-lg" id="catalog-panel">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
            <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2 font-heading">
              <List className="text-accent w-4 h-4" /> Farm Catalog Manager
            </h3>
            <button 
              onClick={() => handleOpenModal('create')}
              className="bg-accent hover:bg-accent-hover text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> New Product
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-yellow-500/10">
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Thumbnail</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Product Title</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Category</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Base Price</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Tag Label</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Nutrition Stats</th>
                  <th className="text-left p-4 text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold">Action Controls</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-xs text-gray-400">Loading catalog items...</td>
                  </tr>
                ) : (
                  products.map(p => {
                    const nut = p.nutrition || {};
                    const nutStr = `Cals: ${nut.calories || 'N/A'}, Carbs: ${nut.carbs || 'N/A'}, Fiber: ${nut.fiber || 'N/A'}, Protein: ${nut.protein || 'N/A'}`;

                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="p-4">
                          <img 
                            src={p.image.startsWith('/') ? p.image : `/${p.image}`} 
                            alt={p.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 bg-white/5" 
                            onError={(e) => { e.target.src = '/assets/peaches.png'; }}
                          />
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-200">{p.name}</td>
                        <td className="p-4">
                          <span className="text-[0.65rem] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 capitalize">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-green-400">${p.price.toFixed(2)}</td>
                        <td className="p-4">
                          {p.tag ? (
                            <span className="text-[0.65rem] bg-accent/10 border border-yellow-500/25 text-accent px-2 py-0.5 rounded font-semibold">
                              {p.tag}
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-gray-400 max-w-[200px] truncate" title={nutStr}>{nutStr}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenModal('edit', p)}
                              className="inline-flex items-center gap-1 bg-white/5 hover:bg-accent hover:text-slate-950 border border-yellow-500/10 px-2 py-1 rounded text-[0.7rem] font-semibold transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/25 px-2 py-1 rounded text-[0.7rem] font-semibold transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* CRUD MODAL POPUP */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-[580px] bg-slate-900/95 border border-yellow-500/10 rounded-2xl overflow-y-auto max-h-[85vh] p-6 sm:p-8 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <h3 className="text-lg font-heading font-bold text-accent">
                {modalMode === 'create' ? 'Create New Farm Product' : 'Modify Product Specifications'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 text-sm text-gray-200">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-gray-400">Product Name</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  required 
                  placeholder="e.g. Heirloom Radishes"
                  className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Category</label>
                  <select 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)} 
                    required
                    className="bg-slate-900 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="pantry">Pantry</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Base Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.10" 
                    value={formPrice} 
                    onChange={(e) => setFormPrice(e.target.value)} 
                    required 
                    placeholder="e.g. 9.99"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Tag Label</label>
                  <input 
                    type="text" 
                    value={formTag} 
                    onChange={(e) => setFormTag(e.target.value)} 
                    placeholder="e.g. Special Offer"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Product Image File</label>
                  <select 
                    value={formImage} 
                    onChange={(e) => setFormImage(e.target.value)}
                    className="bg-slate-900 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  >
                    <option value="assets/strawberries.png">Strawberries (assets/strawberries.png)</option>
                    <option value="assets/avocados.png">Avocados (assets/avocados.png)</option>
                    <option value="assets/honey.png">Honey (assets/honey.png)</option>
                    <option value="assets/tomatoes.png">Tomatoes (assets/tomatoes.png)</option>
                    <option value="assets/peaches.png">Peaches (assets/peaches.png)</option>
                    <option value="assets/apricots.png">Apricots (assets/apricots.png)</option>
                    <option value="assets/green.jpg">Green Apple (assets/green.jpg)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-gray-400">Short Description</label>
                <input 
                  type="text" 
                  value={formShortDesc} 
                  onChange={(e) => setFormShortDesc(e.target.value)} 
                  required 
                  placeholder="One-line snippet for storefront card"
                  className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-gray-400">Long Description (Detailed)</label>
                <textarea 
                  value={formLongDesc} 
                  onChange={(e) => setFormLongDesc(e.target.value)} 
                  required 
                  rows="3" 
                  placeholder="Detailed information for the zoom view modal panel"
                  className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent resize-none"
                />
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-accent mt-2 text-left">
                Nutritional Values
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Calories (e.g. &apos;32 kcal&apos;)</label>
                  <input 
                    type="text" 
                    value={formCalories} 
                    onChange={(e) => setFormCalories(e.target.value)} 
                    placeholder="32 kcal"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Carbs (e.g. &apos;7.7g&apos;)</label>
                  <input 
                    type="text" 
                    value={formCarbs} 
                    onChange={(e) => setFormCarbs(e.target.value)} 
                    placeholder="7.7g"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Fiber (e.g. &apos;2.0g&apos;)</label>
                  <input 
                    type="text" 
                    value={formFiber} 
                    onChange={(e) => setFormFiber(e.target.value)} 
                    placeholder="2.0g"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-gray-400">Protein (e.g. &apos;0.7g&apos;)</label>
                  <input 
                    type="text" 
                    value={formProtein} 
                    onChange={(e) => setFormProtein(e.target.value)} 
                    placeholder="0.7g"
                    className="bg-white/5 border border-yellow-500/10 rounded-lg p-2.5 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-hover text-slate-950 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {modalMode === 'create' ? 'Publish Product' : 'Apply Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
