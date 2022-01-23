const {ConsoleSpanExporter, SimpleSpanProcessor} = require("@opentelemetry/sdk-trace-base");
const {NodeTracerProvider} = require("@opentelemetry/sdk-trace-node");
const {registerInstrumentations} = require("@opentelemetry/instrumentation");
const {HttpInstrumentation} = require("@opentelemetry/instrumentation-http");
const {ExpressInstrumentation} = require("@opentelemetry/instrumentation-express");
const {MongoDBInstrumentation} = require("@opentelemetry/instrumentation-mongodb");

const setUp = () => {
	const exporter = new ConsoleSpanExporter();

	const provider = new NodeTracerProvider();

	registerInstrumentations({
		tracerProvider: provider,
		instrumentations: [
			new HttpInstrumentation(),
			new ExpressInstrumentation(),
			new MongoDBInstrumentation(),
		],
	});

	provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

	provider.register();

	console.log("Tracing initialized");
};

setUp();
