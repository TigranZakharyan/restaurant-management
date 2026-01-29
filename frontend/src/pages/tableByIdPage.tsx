"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Trash2, Receipt } from "lucide-react";
import { Header } from "@/components/header";
import {
  fetchProductsByCategory,
  addProductToOrder,
  deleteOrderItems,
  payOrder
} from "@/api";
import { TCategory, TOrder, TProduct, TTable } from "@/api/types";
import { useRouter } from "next/navigation";

type Props = {
  table: TTable | null;
  categories: TCategory[];
};



export default function TableByIdPage({ table, categories }: Props) {
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [orderItems, setOrderItems] = useState<TOrder[]>([]);
  const [modalProduct, setModalProduct] = useState<TProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ================= NEW STATES =================
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<"cash" | "pos">("cash");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!table || !table.orderId) return null;

  const orderId = table.orderId._id;

  // Load existing order on mount
  useEffect(() => {
    const items = table.orderId.items.map(i => ({
      product: i.productId,
      quantity: i.quantity,
      checked: false
    }));
    setOrderItems(items);
  }, [table]);

  /* ================= CATEGORY ================= */
  const handleSelectCategory = async (category: TCategory) => {
    setSelectedCategory(category);
    setProducts(await fetchProductsByCategory(category._id));
  };
  const backToCategories = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  /* ================= ADD / EDIT MODAL ================= */
  const openAddModal = (product: TProduct) => {
    setModalProduct(product);
    setModalQuantity(1);
    setEditIndex(null);
  };
  const openEditModal = (index: number) => {
    setModalProduct(orderItems[index].product);
    setModalQuantity(orderItems[index].quantity);
    setEditIndex(index);
  };

  const saveModal = async () => {
    if (!modalProduct) return;

    if (editIndex !== null) {
      await addProductToOrder(orderId, modalProduct._id, modalQuantity - orderItems[editIndex].quantity);
      setOrderItems(prev =>
        prev.map((i, idx) =>
          idx === editIndex ? { ...i, quantity: modalQuantity } : i
        )
      );
    } else {
      await addProductToOrder(orderId, modalProduct._id, modalQuantity);

      const exists = orderItems.find(i => i.product._id === modalProduct._id);
      if (exists) {
        setOrderItems(prev =>
          prev.map(i =>
            i.product._id === modalProduct._id
              ? { ...i, quantity: i.quantity + modalQuantity }
              : i
          )
        );
      } else {
        setOrderItems(prev => [
          ...prev,
          { product: modalProduct, quantity: modalQuantity, checked: false }
        ]);
      }
    }

    setModalProduct(null);
    setEditIndex(null);
  };

  /* ================= BILL ================= */
  const toggleCheck = (index: number) => {
    setOrderItems(prev =>
      prev.map((i, idx) =>
        idx === index ? { ...i, checked: !i.checked } : i
      )
    );
  };
  const checkedItems = orderItems.filter(i => i.checked);

  const handleDeleteChecked = async () => {
    const productIds = checkedItems.map(i => i.product._id);
    const result = await deleteOrderItems(orderId, productIds);
    if (result) {
      setOrderItems(prev => prev.filter(i => !i.checked));
      setShowDeleteModal(false);
    }
  };

  const total = orderItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  /* ================= PAY ================= */
  const handlePay = async () => {
    const success = await payOrder(orderId)
    if(success) {
      setShowSuccess(true);
      setShowPayModal(false)
      setTimeout(() => {
        setShowSuccess(false)
        router.replace('/tables')
      }, 1000);
      
    }
    
  };

  return (
    <>
      <Header tableNumber={table.title} includeBack />

      <div className="grid grid-cols-[1.2fr_2fr] gap-6 p-6 bg-gray-200">
        {/* ================= LEFT: BILL ================= */}
        <div className="bg-white rounded-xl p-6 flex flex-col">
          <h2 className="text-3xl font-semibold text-center mb-4">Bill</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {orderItems.length === 0 && (
              <p className="text-center text-gray-400 text-lg mt-10">No items added</p>
            )}

            {orderItems.map((item, idx) => (
              <div key={item.product._id} className="flex items-center gap-4 py-4 border-b rounded-lg hover:bg-gray-50 px-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(idx)}
                  className="w-6 h-6"
                />
                <button
                  onClick={() => openEditModal(idx)}
                  className="flex-1 grid grid-cols-[1fr_80px_100px] gap-4 text-left"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.product.title}</p>
                    <p className="text-gray-500 text-sm">{item.quantity} × ${item.product.price}</p>
                  </div>
                  <div className="text-center text-lg font-medium">{item.quantity}</div>
                  <div className="text-right font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</div>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={!checkedItems.length}
                className="p-4 bg-red-100 rounded-xl disabled:opacity-50"
              >
                <Trash2 className="w-8 h-8 text-red-600" />
              </button>

              <button
                onClick={() => setShowBillModal(true)}
                className="p-4 bg-blue-100 rounded-xl"
              >
                <Receipt className="w-8 h-8 text-blue-600" />
              </button>

              <button
                disabled={!orderItems.length}
                onClick={() => setShowPayModal(true)}
                className="w-full bg-green-600 text-white py-4 text-xl rounded-xl disabled:opacity-50"
              >
                Pay
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div>
          {selectedCategory && (
            <div className="flex items-center gap-4 mb-6">
              <button onClick={backToCategories} className="bg-gray-300 p-6 rounded-xl">
                <ChevronLeft className="w-10 h-10" />
              </button>
              <span className="text-2xl font-semibold">Categories / {selectedCategory.title}</span>
            </div>
          )}

          {!selectedCategory && (
            <div className="flex flex-wrap gap-6">
              {categories.map(c => (
                <button key={c._id} onClick={() => handleSelectCategory(c)}
                  className="w-[200px] h-[200px] bg-white rounded-3xl flex flex-col items-center text-xl shadow overflow-hidden">
                  {c.img && <img src={c.img} alt={c.title} className="w-full h-[140px] border-b-1 border-gray-500" />}
                  <span className="py-3">{c.title}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCategory && (
            <div className="flex flex-wrap gap-6">
              {products.map(p => (
                <button key={p._id} onClick={() => openAddModal(p)}
                  className="w-[200px] h-[200px] bg-white rounded-3xl flex flex-col items-center text-xl shadow overflow-hidden">
                  {p.img && <img src={p.img} alt={p.title} className="w-full h-[140px] border-b-1 border-gray-500" />}
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-gray-500 text-lg">${p.price} / {p.unit}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[450px] text-center space-y-6">
            <h3 className="text-2xl font-bold">{modalProduct.title}</h3>
            <p className="text-gray-500 text-lg">${modalProduct.price} / {modalProduct.unit}</p>
            <div className="flex items-center justify-center gap-8">
              <button onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                className="w-16 h-16 rounded-full bg-gray-300 text-3xl">−</button>
              <span className="text-3xl font-bold">{modalQuantity}</span>
              <button onClick={() => setModalQuantity(q => q + 1)}
                className="w-16 h-16 rounded-full bg-gray-300 text-3xl">+</button>
            </div>
            <p className="text-xl font-bold">Total: ${(modalProduct.price * modalQuantity).toFixed(2)}</p>
            <button onClick={saveModal} className="w-full bg-green-600 text-white py-3 text-xl rounded-xl">Save</button>
            <button onClick={() => setModalProduct(null)} className="text-red-500 text-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* ================= BILL MODAL ================= */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[900px] h-[90vh] flex flex-col print-area">
            <h2 className="text-3xl font-semibold text-center mb-4">Bill</h2>

            <div className="flex-1 overflow-y-auto space-y-3 border rounded-xl p-4">
              {orderItems.map(item => (
                <div key={item.product._id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.product.title}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ${item.product.price}</p>
                  </div>
                  <div className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-2xl font-bold mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-4 mt-6 no-print">
              <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-lg">Print</button>
              <button onClick={() => setShowBillModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl text-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAY MODAL ================= */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[900px] h-[90vh] flex flex-col">
            <h2 className="text-3xl font-semibold text-center mb-4">Pay Bill</h2>

            <div className="flex-1 overflow-y-auto space-y-3 border rounded-xl p-4">
              {orderItems.map(item => (
                <div key={item.product._id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.product.title}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ${item.product.price}</p>
                  </div>
                  <div className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-2xl font-bold mt-4 mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="flex gap-4 mb-6">
              <button
                className={`flex-1 py-3 rounded-xl ${payMethod === "cash" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                onClick={() => setPayMethod("cash")}
              >
                Cash
              </button>
              <button
                className={`flex-1 py-3 rounded-xl ${payMethod === "pos" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                onClick={() => setPayMethod("pos")}
              >
                POS
              </button>
            </div>

            {/* Pay / Cancel */}
            <div className="flex gap-4">
              <button onClick={handlePay} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-lg">Pay</button>
              <button onClick={() => setShowPayModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl text-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center space-y-4 animate-fade-in">
            <span className="text-6xl">😊</span>
            <p className="text-xl font-bold">Transaction was successful</p>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[500px] space-y-4">
            <h3 className="text-2xl font-bold text-center text-red-600">Confirm Delete</h3>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedItems.map(i => (
                    <tr key={i.product._id} className="border-t">
                      <td className="p-3">{i.product.title}</td>
                      <td className="p-3 text-center">{i.product.price}$</td>
                      <td className="p-3 text-center">{i.quantity}</td>
                      <td className="p-3 text-right font-medium">${(i.product.price * i.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4">
              <button onClick={handleDeleteChecked} className="flex-1 bg-red-600 text-white py-3 rounded-xl text-lg">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl text-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
