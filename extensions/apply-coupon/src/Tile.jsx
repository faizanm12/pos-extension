import React, { useEffect, useState } from 'react'

import { Tile, reactExtension, useApi,useCartSubscription } from '@shopify/ui-extensions-react/point-of-sale'

const TileComponent = () => {
  const api = useApi()
  const cart = useCartSubscription();
  
  const [enabled, setEnabled] = useState(Number(cart?.subtotal) > 0);
  
  useEffect(() => {
    setEnabled(Number(cart?.subtotal) > 0)
  },[cart?.subtotal])

  return (
    <Tile
      title="Apply Retainley"
      subtitle="Get retainley coupon applied on your cart"
      onPress={() => {
        api.action.presentModal()
      }}
      enabled={enabled}
    />
  )
}

export default reactExtension('pos.home.tile.render', () => {
  return <TileComponent />
})