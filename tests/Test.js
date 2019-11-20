const {
  sendAndCall
} = require('./util/Helpers');

const future = 1893492061;

async function deployExchange() {
	const [token1, token2] = await Promise.all([
		deploy("FaucetToken", ["100", "token1", 18, "TK1"]), // faucet to acct 1
		deploy("FaucetToken", ["100", "token2", 18, "TK2"]), 
	]);

	const exchange = await deploy("StandardExchange", [token1.address, token2.address, 997, 1000, "DINO"]);

	return {
		token1: token1,
		token2: token2,
		exchange: exchange
	};
}

describe("Tests", () => {

	it('add liquidity', async () => {
		const {token1, token2, exchange} = await deployExchange();
		await send(token1.methods.approve(exchange.address, 20));
		await send(token2.methods.approve(exchange.address, 20));
		const uniTokenSupply = await sendAndCall(exchange.methods.addLiquidity(10, 10, 10, future));
		expect(uniTokenSupply.toNumber()).toEqual(10);
		const token2Bal = await call(token2.methods.balanceOf(accounts[0])); 
		expect(token2Bal.toNumber()).toEqual(90);
	},30000);
});

