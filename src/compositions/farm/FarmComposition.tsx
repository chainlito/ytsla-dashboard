import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Config from 'config';

import { Container, Header, Footer } from 'components';
import { RootState } from 'types';
import { selectAccount } from 'store/account/accountSelector';
import PoolCard from './PoolCard';

import Farm1Icon from 'assets/img/token-stake.png';
import Farm2Icon from 'assets/img/token-uni.png';
import Farm3Icon from 'assets/img/token-lp.png';

interface StateFromProps {
  account: ReturnType<typeof selectAccount>;
}
interface DispatchFromProps {}
interface OwnProps {}

type Props = StateFromProps & DispatchFromProps & OwnProps;

const FarmComposition = () => {
  return (
    <React.Fragment>
      <Header />
      <Container>
        <div className='flex-v screen-center'>
          <div className='mt-30 mb-20 center-h'>
          </div>
          <div className='mb-20'>
            <div className='center-h text-title mb-10'>
              Select a farm
            </div>
            <div className='center-h text-small'>
              Earn {Config.Token.symbol} tokens by providing liquidity
            </div>
          </div>
          <div className='center-h wp-100 mt-30 home-container'>
            <PoolCard stakingToken={Config.MemeToken} picture={Farm1Icon} poolUrl='/farm-meme' />
            <PoolCard stakingToken={Config.UniToken} picture={Farm2Icon} poolUrl='/farm-uni' />
            <PoolCard stakingToken={Config.UniLpToken} picture={Farm3Icon} poolUrl='/farm-lp' />
          </div>
        </div>
      </Container>
      <Footer />
    </React.Fragment>
  )
}

function mapStateToProps(
  state: RootState,
): StateFromProps {
  return {
    account: selectAccount(state),
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FarmComposition)
