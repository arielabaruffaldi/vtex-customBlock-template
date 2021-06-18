import React, { useState } from 'react';
import { TimeSplit } from './typings/global';
import { tick, getTwoDaysFromNow } from './utils/time';
import { useCssHandles } from 'vtex.css-handles';
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps {
  targetDate: string
}

const CSS_HANDLES = ['countdown'];

const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  targetDate = DEFAULT_TARGET_DATE,
}) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES);

  const { product } = useProduct();

  const { data } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  });

  if (!product) {
    tick(targetDate, setTime)
  }else{
    tick(data?.product?.releaseDate, setTime)
  }


  return (
    <div className={`${handles.countdown} c-muted-1 db tc`}>
      <h1>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </h1>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Final date',
      description: 'Final date used in the countdown',
      type: 'string',
      default: null,
    }
  },
}

export default Countdown
