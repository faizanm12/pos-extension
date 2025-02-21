import React, { useState } from 'react'

import {TextField,EmailField, Text, Screen, ScrollView, Navigator, reactExtension, Stack, Button, useApi } from '@shopify/ui-extensions-react/point-of-sale'

const Modal = () => {
  const [clientID, setClientID] = useState()
  const [email, setEmail] = useState()
  const [cartAmount, setCartAmount] = useState();
  const api = useApi();
  api.cart.subscribable.subscribe((cart) => setCartAmount(cart.subtotal))
  const applyDiscount = () => {
    if(isNaN(clientID)){
      api.toast.show('Please enter valid Client ID')
      return;
    }
    const x = `Client:${clientID}`
    api.cart.addCartCodeDiscount('TESTING50')
    api.toast.show('Retainley Coupon Applied')
  }
  return (
    <Navigator>
      <Screen name="HelloWorld" title="Hello World!">
        <ScrollView>
          <Stack direction="vertical">
            <Text>Enter Client ID</Text>
             <TextField
            label="Client ID"
            placeholder="Enter Client ID here..."
            required={true}
            value={clientID}
            onChange={setClientID}
          />
          <Text>Enter Email</Text>
           <EmailField
            label="Email"
            placeholder="example@email.com"
            helpText="Please enter a valid email"
            value={email}
            onChange={setEmail}
            required={true}
          />
          <Button onPress={applyDiscount} title='Get Retainley Coupon'></Button>
          </Stack>
        </ScrollView>
      </Screen>
    </Navigator>
  )
}

export default reactExtension('pos.home.modal.render', () => <Modal />);