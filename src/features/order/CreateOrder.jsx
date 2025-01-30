import { useState } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from '../../features/cart/EmptyCart'
import store from '../../store'
import { formatCurrency } from "../../utlilities/helpers";
import {fetchAddress} from '../../features/user/userSlice'
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const dispatch = useDispatch();
    const formErros = useActionData()
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting'
  const {username, status: addressStatus, address, position, error:errorAddress} = useSelector(state => state.user)
  const isLoadingAddress = addressStatus === 'loading'
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice= withPriority ? totalCartPrice * 0.2: 0;
  const totalPrice = priorityPrice + totalCartPrice
  if (!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2  className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
      

      <Form method="POST" action="/order/new">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input type="text" name="customer" className="input" defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone"  className="input w-full"required />
          </div>
          {formErros?.phone && <p>{formErros.phone}</p>}
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label  className="sm:basis-40">Address</label>
          <div className="grow">
            <input type="text" className= "input w-full"
             name="address" required  disabled = {isLoadingAddress} defaultValue={address}/>
              {addressStatus === 'error' && <p>{errorAddress}</p>}
          </div>
         {!position.latitude && !position.longitude &&  <span className="">
          <Button type = "small" onClick={(e)=> {
            e.preventDefault();
            dispatch(fetchAddress())}} disabled={isLoadingAddress}>Get postion</Button>
          </span>}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring-offset-2 focus:ring-yellow-500"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type = 'hidden' name = 'cart' value = {JSON.stringify(cart)}/>
          <input type = "hidden" name = 'position' value = {position.longitude && position.latitde ? `${position.longititde}, ${position.latitide}`: ''}/>
          <Button disabled = {isSubmitting || isLoadingAddress } type = "primary">{isSubmitting ? 'Placing Order' : `Order now from ${formatCurrency(totalPrice)}` }</Button>
        </div>
      </Form>

    </div>
  );
}
// After we submit the form the action function handles what will happen
export async function action({request}) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
 
  const order ={
    ...data, 
    cart:JSON.parse(data.cart),
    priority:data.priority === 'true'
  }
  const errors = {};
  
  
  
  if(!isValidPhone(order.phone)) {
    errors.phone = "Please enter valid phone number"
  }
  if(Object.keys(errors).length > 0) return errors
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
 
  console.log(order);
  return redirect(`/order/${newOrder.id}`); // since we cant use useNavigate inside function we use redirect to navigate to the new order we just created after submitting the form
  

}

export default CreateOrder;
