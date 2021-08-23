import React, { useRef, useEffect, useState } from "react";

export default function Paypal(props) {
  const paypal = useRef();
  const [checkout, setCheckOut] = useState(false);

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          let units = props.getProduits();
          console.log(units);
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: units,
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          props.handleSuccess();
          console.log(order);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  return <div ref={paypal}></div>;
}
