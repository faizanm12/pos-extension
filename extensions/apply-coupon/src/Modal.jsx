import {
  Button,
  Navigator,
  reactExtension,
  Screen,
  ScrollView,
  Stack,
  Text,
  useApi,
  useCartSubscription
} from '@shopify/ui-extensions-react/point-of-sale';
import React, { useEffect, useState } from 'react';


const Modal = () => {
  const cart = useCartSubscription();
  const api = useApi();

  const [customerID, setCustomerID] = useState();
  const [cartTotal, setCartTotal] = useState();
  const [walletBalance, setWalletBalance] = useState(0)
  const [couponAmount, setCouponAmount] = useState(0)
  const [couponCode, setCouponCode] = useState();
  const [dataFetched, setDataFetched] = useState();

  const clientID = 'Q2xpZW50OjIyNw==';
  const clientToken = '6547f6067864ec379212230b2c8c5a52';

  useEffect(() => {
    setCustomerID(cart?.customer?.id)
    setCartTotal(cart?.subtotal)
  },[cart?.subtotal,cart?.customer?.id])

  const applyDiscount = () => {
      api.cart.addCartCodeDiscount(`${couponCode}`)
      api.toast.show('Coupon Applied')
  }

  const getRetainleyCoupon = async () => {
    if(Number(cart?.subtotal) === 0){
      api.toast.show('Nothing in your cart.');
      return;
    }
    if (!cart?.customer?.id) {
        api.toast.show('No customer found in cart.');
        return;
    }

    try {
      const BASE_URL = 'fastloyaltystageapi.farziengineer.co';
      const response = await fetch(`https://${BASE_URL}/get-pos-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              client_id: clientID,
              client_token: clientToken,
              customer_id: customerID,
              cart_total: cartTotal,
            })
      });
      
      const data = await response.json();

      if(data?.status === 'failed'){
        api.toast.show(`Error:${response?.message}`)
        return;
      }
      else{
        setDataFetched(true)
        setWalletBalance(data?.data?.remaining_user_balance);
        setCouponAmount(data?.data?.coupon_amount);
        setCouponCode(data?.data?.coupon_code)
      }
    } catch (error) {
      console.error('Error fetching cashback:', error);
      api.toast.show('An error occurred.');
    }
  };

  return (
    <Navigator>
      <Screen name="Get Coupon" title="Retainley Coupons">
        <ScrollView>
          <Stack direction="vertical" gap={2}>
            <Button onPress={getRetainleyCoupon} title="Fetch Retainley Coupon" />
            {dataFetched && (
              <>
                <Text>Remaining Wallet Balance : <Text emphasis="bold">{walletBalance}</Text></Text>
                <Text>Coupon Amount : <Text emphasis="bold">{couponAmount}</Text></Text>
                <Button onPress={applyDiscount} title="Apply Coupon" />
              </>
            )}
          </Stack>
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

export default reactExtension('pos.home.modal.render', () => <Modal />);
