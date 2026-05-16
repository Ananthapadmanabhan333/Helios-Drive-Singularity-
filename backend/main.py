import uvicorn
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
import time

app = FastAPI(title="HELIOS-DRIVE SINGULARITY API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "HELIOS-DRIVE SINGULARITY ONLINE", "version": "1.0.0-SINGULARITY"}

from agents import run_autonomy_cycle

@app.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Run the LangGraph autonomy cycle
            autonomy_result = run_autonomy_cycle("HELIOS-001")
            
            telemetry = {
                "timestamp": time.time(),
                "vehicle_id": autonomy_result["vehicle_id"],
                "position": {
                    "x": random.uniform(-100, 100),
                    "y": 0,
                    "z": random.uniform(-100, 100)
                },
                "velocity": autonomy_result["velocity"],
                "risk_score": autonomy_result["risk_level"],
                "decision": autonomy_result["active_decision"],
                "perception": {
                    "objects_detected": len(autonomy_result["detected_objects"]),
                    "occupancy_grid_status": "OPTIMAL"
                },
                "system_health": {
                    "cpu_load": random.uniform(20, 80),
                    "gpu_load": random.uniform(40, 95),
                    "inference_latency": random.uniform(5, 45)
                }
            }
            await websocket.send_text(json.dumps(telemetry))
            await asyncio.sleep(0.5) # 2Hz for cleaner stream in demo
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
