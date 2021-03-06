import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Config from 'config';
import { RootState } from 'types';
import { coingeckoclient, web3client } from 'lib';
import { numberWithDecimals } from 'utils';
import { selectAccount } from 'store/account/accountSelector';


interface StateFromProps {
	account: ReturnType<typeof selectAccount>;
}
interface DispatchFromProps {}
interface OwnProps {
	tokenPrice: number;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

const Pool2Stats = ({ tokenPrice, account }: Props) => {
  /*const [totalSupply, setTotalSupply] = React.useState<number>(0);*/
  const [token1Price, setToken1Price] = React.useState<number>(0);
	const [totalStaked, setTotalStaked] = React.useState<number>(0);
	const [staked, setStaked] = React.useState<number>(0);
  const [earned, setEarned] = React.useState<number>(0);
  const [roiUnit, setRoiUnit] = React.useState<number>(0);
  const [rate, setRate] = React.useState<number>(0);

  useEffect(() => {
    web3client.getTotalSupply(web3client.pool2Contract)
			.then(res => setTotalStaked(res));
		if (account) {
			web3client.getBalance(web3client.pool2Contract, account.address)
				.then(res => setStaked(res));
			web3client.poolGetEarned(web3client.pool2Contract, account.address)
				.then(res => setEarned(res));
		}
    coingeckoclient.getUniPrice().then(res => setToken1Price(res));
	});

  useEffect(() => {
    if (token1Price > 0) {
      web3client.poolGetRewardRate(web3client.pool2Contract).then(res => {
				if (tokenPrice > 0) {
					const roi = res * tokenPrice / Math.pow(10, 18) / token1Price;
					setRoiUnit(roi);
				}
        setRate(res * staked / Math.pow(10, 36));
      });
    }
  }, [token1Price, tokenPrice, staked]);
	
  return (
    <React.Fragment>
      <h2 className='mb-20 ystatstitle'>{Config.UniToken.name} staking pool</h2>
	  	<div className='cardoutline'>
      	<div className='ystatshead'>PRICES <span className='ybullets'> • • • • • • • • • • • • • • • • • • • • • • • • • •</span></div>
	  		<div className='flex-h'>
      		<div className='datasplit'>{`1 ${Config.UniToken.symbol} =`}</div>
	  			<div className='blackdata'> {`$ ${numberWithDecimals(token1Price, 0, 2)}`}</div>
	  		</div>
				<div className='flex-h'>
					<div className='datasplit'>{`1 ${Config.Token.symbol} = `}</div>
					<div className='blackdata'> {`$ ${numberWithDecimals(tokenPrice, 0, 2)}`}</div>
				</div>
				<br/>
				<div className='ystatshead'>STAKING <span className='ybullets'> • • • • • • • • • • • • • • • • • • • • • • • • • •</span></div>	 
				<div className='flex-h'>
					<div className='datasplit'>
						There are total &nbsp;
					</div>
					<div className='blackdata'>
						{`${numberWithDecimals(totalStaked, Config.UniToken.decimals, Config.Utils.decimals)} ${Config.UniToken.symbol} staked in ${Config.Token.symbol}'s ${Config.UniToken.symbol} staking pool.`}
						<br/>
						{`= $ ${numberWithDecimals(totalStaked * token1Price, Config.UniToken.decimals, 2)}`}
					</div>
				</div>
				<div className='flex-h'>
					<div className='datasplit'>
						You are staking &nbsp;
					</div>
					<div className='blackdata'>
						{`${numberWithDecimals(staked, Config.UniToken.decimals, Config.Utils.decimals)} ${Config.UniToken.symbol} (${(staked / totalStaked * 100).toFixed(2)}% of the pool)`}
						<br/>
						{`= $ ${numberWithDecimals(staked * token1Price, Config.UniToken.decimals, 2)}`}
					</div>
				</div>
				<br/>
	  		<div className='ystatshead'>{Config.Token.symbol} REWARDS <span className='ybullets'> • • • • • • • • • • • • • • • • • • •</span></div>
				<div className='flex-h'>
					<div className='datasplit'>{`Claimable rewards`}</div>
					<div className='blackdata'>
						{`${numberWithDecimals(earned, Config.Token.decimals, Config.Utils.decimals)} ${Config.Token.symbol} = $${numberWithDecimals(earned * tokenPrice, Config.Token.decimals, 2)}`}
					</div>
				</div>
	      <div className='flex-h'>
          <div className='datasplit'>{`Hourly estimate`}</div>
          <div className='blackdata'>
            {`${numberWithDecimals(rate * 3600, 0, Config.Utils.decimals)} ${Config.Token.symbol} = $${(rate * 3600 * tokenPrice).toFixed(2)}`}
          </div>
	      </div>	  
	      <div className='flex-h'>
          <div className='datasplit'>{`Daily estimate`}</div>
          <div className='blackdata'>
            {`${numberWithDecimals(rate * 3600 * 24, 0, Config.Utils.decimals)} ${Config.Token.symbol} = $${(rate * 3600 * 24 * tokenPrice).toFixed(2)}`}
          </div>
	      </div>	  
	      <div className='flex-h'>
          <div className='datasplit'>{`Weekly estimate`}</div>
          <div className='blackdata'>
            {`${numberWithDecimals(rate * 3600 * 24 * 7, 0, Config.Utils.decimals)} ${Config.Token.symbol} = $${(rate * 3600 * 24 * 7 * tokenPrice).toFixed(2)}`}
          </div>
	      </div>	  
				<br />
				<div className='flex-h'>
					<div className='datasplit'>{`Hourly ROI in USD`}</div>
					<div className='blackdata'> {`${numberWithDecimals(roiUnit * 3600 * 100, 0, 2)}%`}</div>
				</div>
				<div className='flex-h'>
					<div className='datasplit'>{`Daily ROI in USD`}</div>
					<div className='blackdata'> {`${numberWithDecimals(roiUnit * 86400 * 100, 0, 2)}%`}</div>
				</div>
				<div className='flex-h'>
					<div className='datasplit'>{`Weekly ROI in USD`}</div>
					<div className='blackdata'> {`${numberWithDecimals(roiUnit * 86400 * 7 * 100, 0, 2)}%`}</div>
				</div>
				<div className='flex-h'>
					<div className='datasplit'>{`APY (unstable)`}</div>
					<div className='blackdata'> {`${numberWithDecimals(roiUnit * 86400 * 365 * 100, 0, 2)}%`}</div>
				</div>
			</div>
    </React.Fragment>
  )
};

function mapStateToProps(
  state: RootState,
): StateFromProps {
  return {
		account: selectAccount(state),
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pool2Stats);
