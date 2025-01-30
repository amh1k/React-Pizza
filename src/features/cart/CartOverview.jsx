import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity} from "./cartSlice";
import {formatCurrency} from "../../utlilities/helpers"

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPirce = useSelector(getTotalCartPrice);
  if (!totalCartQuantity) return null;
  return (
    <div className="flex items-center justify-between text-stone-200 bg-stone-800 p-4 uppercase text-sm sm:px-6 md:text-base">
      <p className="space-x-4 text-stone-300 font-semibold sm:space-x-6">
        <span>{totalCartQuantity}pizzas</span>
        <span>{formatCurrency(totalCartPirce)}</span>
      </p>
      <Link to  = "/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
